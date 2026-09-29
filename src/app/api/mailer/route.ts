import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Contact-form mailer.
 *
 * Credentials live in env vars (MAIL_USER / MAIL_PASS) — they used to be
 * hardcoded here, which is unsafe in a public repository. Input is validated,
 * callers are rate-limited per IP, and raw error details are never echoed
 * back to the client.
 */

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 10; // sends per window per IP

const hits = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    // Opportunistic cleanup so the map cannot grow unbounded.
    if (hits.size > 1000) {
      hits.forEach((value, key) => {
        if (value.reset < now) hits.delete(key);
      });
    }
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  let body: { name?: unknown; email?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (
    !name ||
    name.length > 200 ||
    !EMAIL_RE.test(email) ||
    email.length > 320 ||
    !message ||
    message.length > 5000
  ) {
    return NextResponse.json(
      { error: "Please provide a valid name, email and message." },
      { status: 400 }
    );
  }

  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;
  if (!user || !pass) {
    console.error("[mailer] MAIL_USER / MAIL_PASS are not configured");
    return NextResponse.json(
      { error: "Contact form is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transport.sendMail({
      from: `"${name} (portfolio contact)" <${user}>`,
      replyTo: email,
      to: process.env.MAIL_TO ?? user,
      subject: `Portfolio message from ${name}`,
      text: `${message}\n\n— Reply to: ${email}`,
    });

    return NextResponse.json({ message: "Message sent" }, { status: 200 });
  } catch (error) {
    console.error("[mailer] send failed:", error);
    return NextResponse.json(
      { error: "Could not send the message. Please try again later." },
      { status: 500 }
    );
  }
}
