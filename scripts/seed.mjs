#!/usr/bin/env node
/**
 * Migrates the markdown posts in posts/ into the SQLite database
 * (data/portfolio.db locally, or DATABASE_URL when set — e.g. Turso on Vercel).
 *
 * - Idempotent: existing rows are left untouched unless --force is passed.
 * - Runs automatically as part of `npm run build`; can also be run manually:
 *     npm run db:seed           # only inserts missing posts
 *     npm run db:seed -- --force # overwrites rows from the markdown files
 *
 * On Vercel without DATABASE_URL the database layer is disabled (read-only
 * filesystem) and this script exits without doing anything — the public site
 * reads the markdown files directly in that mode.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@libsql/client";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const postsDir = path.join(root, "posts");
const force = process.argv.includes("--force");

function dbEnabled() {
  if (process.env.DATABASE_URL) return true;
  if (process.env.VERCEL) return false;
  return true;
}

function resolveUrl() {
  const fromEnv = process.env.DATABASE_URL?.trim();
  if (fromEnv) return fromEnv;
  return `file:${path.join(root, "data", "portfolio.db")}`;
}

/**
 * Load .env.local for keys not already in the environment. Next.js injects
 * these into its own process only — a plain `node scripts/seed.mjs` would
 * otherwise silently miss DATABASE_URL/TURSO_AUTH_TOKEN and seed the wrong DB.
 * (No dotenv dependency: values in .env.local are plain KEY=value lines.)
 */
async function loadLocalEnv() {
  let raw;
  try {
    raw = await fs.readFile(path.join(root, ".env.local"), "utf8");
  } catch {
    return; // no .env.local (e.g. Vercel) — real env vars apply as-is
  }
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1] === undefined || process.env[match[1]] !== undefined) continue;
    let value = match[2] ?? "";
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
      (value.startsWith("'") && value.endsWith("'") && value.length > 1)
    ) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS posts (
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
);`;

async function main() {
  await loadLocalEnv();
  if (!dbEnabled()) {
    console.log("[seed] No DATABASE_URL and running on Vercel — skipping (markdown mode).");
    return;
  }

  // Ensure the local data/ directory exists before opening the file URL.
  const url = resolveUrl();
  if (url.startsWith("file:")) {
    await fs.mkdir(path.dirname(url.replace(/^file:/, "")), { recursive: true });
  }

  // Turso (libsql://) requires the auth token; local file: URLs must not
  // receive one.
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim() || undefined;
  const db = createClient(authToken ? { url, authToken } : { url });
  await db.execute(SCHEMA);

  const files = (await fs.readdir(postsDir)).filter((f) => f.endsWith(".md"));
  let inserted = 0;
  let skipped = 0;

  for (const file of files) {
    const id = file.replace(/\.md$/, "");
    const raw = await fs.readFile(path.join(postsDir, file), "utf8");
    const { data, content } = matter(raw);

    const row = {
      id,
      title: String(data.title ?? id),
      date: String(data.date ?? ""),
      author: String(data.author ?? ""),
      category: String(data.category ?? ""),
      description: String(data.description ?? ""),
      tags: JSON.stringify(Array.isArray(data.tags) ? data.tags : []),
      cover: `/images/${id}.jpg`,
      content,
      published: 1,
    };

    if (force) {
      await db.execute({
        sql: `INSERT INTO posts (id, title, date, author, category, description, tags, cover, content, published)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET title=excluded.title, date=excluded.date,
                author=excluded.author, category=excluded.category,
                description=excluded.description, tags=excluded.tags, cover=excluded.cover,
                content=excluded.content, published=excluded.published`,
        args: [row.id, row.title, row.date, row.author, row.category, row.description, row.tags, row.cover, row.content, row.published],
      });
      inserted++;
      continue;
    }

    try {
      await db.execute({
        sql: `INSERT INTO posts (id, title, date, author, category, description, tags, cover, content, published)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [row.id, row.title, row.date, row.author, row.category, row.description, row.tags, row.cover, row.content, row.published],
      });
      inserted++;
    } catch (error) {
      if (error?.code === "SQLITE_CONSTRAINT" || /constraint/i.test(String(error?.message))) {
        skipped++;
      } else {
        throw error;
      }
    }
  }

  const count = await db.execute("SELECT COUNT(*) AS n FROM posts");
  console.log(
    `[seed] done — inserted ${inserted}, already present ${skipped}, total ${count.rows[0].n} post(s).`
  );
}

main().catch((error) => {
  console.error("[seed] failed:", error);
  process.exit(1);
});
