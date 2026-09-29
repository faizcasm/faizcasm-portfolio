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
  if (!dbEnabled()) {
    console.log("[seed] No DATABASE_URL and running on Vercel — skipping (markdown mode).");
    return;
  }

  // Ensure the local data/ directory exists before opening the file URL.
  const url = resolveUrl();
  if (url.startsWith("file:")) {
    await fs.mkdir(path.dirname(url.replace(/^file:/, "")), { recursive: true });
  }

  const db = createClient({ url });
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
