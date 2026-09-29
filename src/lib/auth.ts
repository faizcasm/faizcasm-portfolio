import "server-only";
import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { getReadyDb, dbWritable } from "@/lib/db";

/**
 * Admin authentication.
 *
 * Credentials come from environment variables (ADMIN_USERNAME /
 * ADMIN_PASSWORD) — never from source code, because this repository is
 * public. See .env.example.
 *
 * Sessions are random 256-bit tokens: the raw token lives only in the
 * HTTP-only cookie, while the database stores its SHA-256 hash. Stealing the
 * database therefore does not yield usable sessions, and deleting a row
 * instantly revokes the session.
 */

export const SESSION_COOKIE = "faizcasm_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Brute-force protection: sliding window per key (IP or IP+username).
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attemptStore = globalThis as unknown as {
  __loginAttempts?: Map<string, { count: number; resetAt: number }>;
};
const attempts = (attemptStore.__loginAttempts ??= new Map());

function attemptKey(username: string): string {
  return `${clientIp()}|${username.toLowerCase()}`;
}

function clientIp(): string {
  const h = headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") || "local";
}

export function isLoginRateLimited(username: string): boolean {
  const entry = attempts.get(attemptKey(username));
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    attempts.delete(attemptKey(username));
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function registerFailedLogin(username: string): void {
  const key = attemptKey(username);
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearFailedLogins(username: string): void {
  attempts.delete(attemptKey(username));
}

/** Constant-time credential check (hashing both sides fixes length leaks). */
export function verifyCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) return false;

  const a = crypto.createHash("sha256").update(username).digest();
  const b = crypto.createHash("sha256").update(expectedUser).digest();
  const c = crypto.createHash("sha256").update(password).digest();
  const d = crypto.createHash("sha256").update(expectedPass).digest();
  return (
    crypto.timingSafeEqual(a, b) && crypto.timingSafeEqual(c, d)
  );
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Creates a session row and sets the HTTP-only cookie. */
export async function createSession(): Promise<void> {
  const db = await getReadyDb();
  if (!db || !dbWritable()) {
    throw new Error(
      "Sessions require a writable database. Set DATABASE_URL (e.g. Turso) to enable the admin panel."
    );
  }
  const token = crypto.randomBytes(32).toString("base64url");
  const now = Date.now();
  await db.execute({
    sql: "INSERT INTO sessions (token, created_at, expires_at) VALUES (?, ?, ?)",
    args: [hashToken(token), now, now + SESSION_TTL_MS],
  });
  // Opportunistic cleanup of expired sessions.
  await db.execute({
    sql: "DELETE FROM sessions WHERE expires_at < ?",
    args: [now],
  });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

/** Validates the session cookie against the database. */
export async function isAuthenticated(): Promise<boolean> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const db = await getReadyDb();
  if (!db) return false;
  try {
    const result = await db.execute({
      sql: "SELECT expires_at FROM sessions WHERE token = ?",
      args: [hashToken(token)],
    });
    if (result.rows.length === 0) return false;
    const expiresAt = Number(result.rows[0].expires_at);
    if (expiresAt < Date.now()) {
      await db.execute({
        sql: "DELETE FROM sessions WHERE token = ?",
        args: [hashToken(token)],
      });
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** Deletes the current session and clears the cookie. */
export async function destroySession(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    const db = await getReadyDb();
    if (db) {
      try {
        await db.execute({
          sql: "DELETE FROM sessions WHERE token = ?",
          args: [hashToken(token)],
        });
      } catch {
        // Best effort — cookie is cleared either way.
      }
    }
  }
  cookies().delete(SESSION_COOKIE);
}
