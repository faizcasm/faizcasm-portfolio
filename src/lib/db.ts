import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { createClient, type Client } from "@libsql/client";

/**
 * SQLite database access layer.
 *
 * - Locally (dev / `next start`) the database is a local SQLite file at
 *   `data/portfolio.db` (schema created and seeded from posts/*.md
 *   automatically on first access).
 * - On Vercel's read-only serverless filesystem a local file cannot be
 *   persisted, so set `DATABASE_URL` to a libSQL/Turso URL
 *   (e.g. `libsql://<db>-<org>.turso.io` plus `TURSO_AUTH_TOKEN` when using
 *   Turso) for persistent storage. The exact same code path serves both.
 *
 * When no DATABASE_URL is configured and the app runs on Vercel, the DB layer
 * is skipped entirely and blog reads fall back to the markdown files in
 * `posts/` (see utils/markdown.ts), so the public site keeps working; admin
 * writes report a clear "database not configured" error in that mode.
 */

export const POSTS_TABLE = "posts";

export interface PostRow {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  description: string;
  tags: string; // JSON-encoded string[]
  cover: string | null;
  content: string;
  published: number; // 0 | 1
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS ${POSTS_TABLE} (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '[]',
  cover TEXT,
  content TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
`;

/** True when the database layer should be used for reads and writes. */
export function dbEnabled(): boolean {
  if (process.env.DATABASE_URL) return true;
  // On Vercel's serverless runtime there is no writable (or bundled) local
  // filesystem for the SQLite file — fall back to markdown reads.
  if (process.env.VERCEL) return false;
  return true;
}

/** True when admin writes can be persisted. */
export function dbWritable(): boolean {
  return dbEnabled();
}

function resolveUrl(): string {
  const fromEnv = process.env.DATABASE_URL?.trim();
  if (fromEnv) return fromEnv;
  return `file:${path.join(process.cwd(), "data", "portfolio.db")}`;
}

// Memoize the client (and schema + seed bootstrap) across dev hot-reloads
// and per-request module re-evaluation.
const globalStore = globalThis as unknown as {
  __portfolioDb?: { client: Client; ready: Promise<void> };
};

/**
 * Create the schema and run the one-time migration of the markdown posts in
 * posts/ into the database. Guarded by a `meta` marker row so it never runs
 * twice — and so posts deleted later via the admin panel stay deleted.
 */
async function bootstrap(client: Client): Promise<void> {
  // libsql client executes one statement per call for multi-statement
  // strings only via migrate; run them individually to stay portable.
  for (const statement of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) {
    await client.execute(statement);
  }

  const marker = await client.execute({
    sql: "SELECT value FROM meta WHERE key = ?",
    args: ["seeded_from_markdown"],
  });
  if (marker.rows.length > 0) return;

  const postsDir = path.join(process.cwd(), "posts");
  let files: string[] = [];
  try {
    files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  } catch {
    files = [];
  }

  for (const file of files) {
    const id = file.replace(/\.md$/, "");
    try {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data, content } = matter(raw);
      await client.execute({
        sql: `INSERT INTO ${POSTS_TABLE}
              (id, title, date, author, category, description, tags, cover, content, published)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
              ON CONFLICT(id) DO NOTHING`,
        args: [
          id,
          String(data.title ?? id),
          String(data.date ?? ""),
          String(data.author ?? ""),
          String(data.category ?? ""),
          String(data.description ?? ""),
          JSON.stringify(Array.isArray(data.tags) ? data.tags : []),
          fs.existsSync(path.join(process.cwd(), "public", "images", `${id}.jpg`))
            ? `/images/${id}.jpg`
            : null,
          content,
        ],
      });
    } catch (error) {
      console.error(`[db] failed to seed ${file}:`, error);
    }
  }

  await client.execute({
    sql: "INSERT INTO meta (key, value) VALUES (?, '1') ON CONFLICT(key) DO NOTHING",
    args: ["seeded_from_markdown"],
  });
}

export function getDb(): Client | null {
  if (!dbEnabled()) return null;
  if (!globalStore.__portfolioDb) {
    const url = resolveUrl();
    if (url.startsWith("file:")) {
      try {
        fs.mkdirSync(path.dirname(url.replace(/^file:/, "")), { recursive: true });
      } catch {
        // Read-only filesystem (e.g. misconfigured Vercel): the ready promise
        // below will reject and callers fall back to markdown.
      }
    }
    // Turso (libsql://) requires the auth token; a local file: URL must not
    // receive one or the native client rejects the option.
    const authToken = process.env.TURSO_AUTH_TOKEN?.trim() || undefined;
    const client = createClient(authToken ? { url, authToken } : { url });
    globalStore.__portfolioDb = { client, ready: bootstrap(client) };
    // Avoid unhandled-rejection noise if no caller awaits immediately.
    globalStore.__portfolioDb.ready.catch(() => {});
  }
  return globalStore.__portfolioDb.client;
}

/** Returns the client after the schema exists and the initial seed ran. */
export async function getReadyDb(): Promise<Client | null> {
  const client = getDb();
  if (!client) return null;
  try {
    await globalStore.__portfolioDb!.ready;
  } catch (error) {
    console.error("[db] database unavailable:", error);
    return null;
  }
  return client;
}

/** Apply a write, surfacing a friendly error when the DB is not writable. */
export async function requireWritableDb(): Promise<Client> {
  if (!dbWritable()) {
    throw new Error(
      "Database is not configured for writes in this environment. Set DATABASE_URL to a libSQL/SQLite URL (e.g. Turso) to enable the admin panel in production."
    );
  }
  const client = await getReadyDb();
  if (!client) {
    throw new Error("Database could not be opened. Check DATABASE_URL.");
  }
  return client;
}

export type { Client };
