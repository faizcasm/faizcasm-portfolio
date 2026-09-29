import "server-only";
import readingTime from "reading-time";
import { requireWritableDb, getReadyDb, POSTS_TABLE, type PostRow, type Client } from "@/lib/db";

/**
 * Admin-facing post CRUD. All writes go through validation and require a
 * writable database (local SQLite file, or DATABASE_URL/Turso in production).
 */

export interface AdminPost {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  description: string;
  tags: string[];
  cover: string | null;
  content: string;
  published: boolean;
  readTime: string;
}

export interface PostInput {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  description: string;
  tags: string;
  cover: string;
  content: string;
  published: boolean;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

/** Parses and validates the comma-separated tag field. */
function parseTags(raw: string): string[] {
  const tags = raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  if (tags.length > 20) throw new ValidationError("A post can have at most 20 tags.");
  for (const tag of tags) {
    if (tag.length > 40) throw new ValidationError(`Tag "${tag.slice(0, 20)}…" is too long (max 40 chars).`);
  }
  return Array.from(new Set(tags));
}

export function validatePost(input: PostInput): {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  description: string;
  tags: string;
  cover: string | null;
  content: string;
  published: number;
} {
  const id = input.id.trim().toLowerCase();
  const title = input.title.trim();
  const date = input.date.trim();
  const content = input.content;
  const description = input.description.trim();

  if (!id) throw new ValidationError("Slug is required.");
  if (!SLUG_RE.test(id)) {
    throw new ValidationError(
      "Slug may only contain lowercase letters, numbers and hyphens (e.g. my-first-post)."
    );
  }
  if (id.length > 96) throw new ValidationError("Slug is too long (max 96 chars).");
  if (!title) throw new ValidationError("Title is required.");
  if (title.length > 200) throw new ValidationError("Title is too long (max 200 chars).");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    throw new ValidationError("Date must be in YYYY-MM-DD format.");
  }
  if (description.length > 500) throw new ValidationError("Description is too long (max 500 chars).");
  if (!content.trim()) throw new ValidationError("Content is required.");
  if (content.length > 500_000) throw new ValidationError("Content is too large (max 500 KB).");

  const tags = parseTags(input.tags);

  // Covers may be site-relative (/images/x.jpg) or absolute https URLs.
  const cover = input.cover.trim();
  if (cover && !cover.startsWith("/images/") && !/^https:\/\//.test(cover)) {
    throw new ValidationError('Cover must start with "/images/" or be an https:// URL.');
  }

  const author = input.author.trim() || "Faizan Hameed Tantray";
  const category = input.category.trim() || "General";

  return {
    id,
    title,
    date,
    author,
    category,
    description,
    tags: JSON.stringify(tags),
    cover: cover || null,
    content,
    published: input.published ? 1 : 0,
  };
}

function rowToAdminPost(row: PostRow): AdminPost {
  let tags: string[] = [];
  try {
    const parsed = JSON.parse(row.tags);
    if (Array.isArray(parsed)) tags = parsed.filter((t) => typeof t === "string");
  } catch {
    tags = [];
  }
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    author: row.author,
    category: row.category,
    description: row.description,
    tags,
    cover: row.cover,
    content: row.content,
    published: row.published === 1,
    readTime: readingTime(row.content).text,
  };
}

export async function listAdminPosts(): Promise<AdminPost[]> {
  const db = await getReadyDb();
  if (!db) return [];
  const result = await db.execute(
    `SELECT * FROM ${POSTS_TABLE} ORDER BY date DESC, id ASC`
  );
  return result.rows.map((row) => rowToAdminPost(row as unknown as PostRow));
}

export async function getAdminPost(id: string): Promise<AdminPost | null> {
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return null;
  const db = await getReadyDb();
  if (!db) return null;
  const result = await db.execute({
    sql: `SELECT * FROM ${POSTS_TABLE} WHERE id = ?`,
    args: [id],
  });
  if (result.rows.length === 0) return null;
  return rowToAdminPost(result.rows[0] as unknown as PostRow);
}

export async function createPost(input: PostInput): Promise<AdminPost> {
  const row = validatePost(input);
  const db = await requireWritableDb();
  try {
    await db.execute({
      sql: `INSERT INTO ${POSTS_TABLE}
            (id, title, date, author, category, description, tags, cover, content, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [row.id, row.title, row.date, row.author, row.category, row.description, row.tags, row.cover, row.content, row.published],
    });
  } catch (error) {
    if (/constraint/i.test(String((error as Error)?.message))) {
      throw new ValidationError(`A post with the slug "${row.id}" already exists.`);
    }
    throw error;
  }
  const created = await getAdminPost(row.id);
  if (!created) throw new Error("Post created but could not be read back.");
  return created;
}

export async function updatePost(originalId: string, input: PostInput): Promise<AdminPost> {
  const row = validatePost(input);
  const db = await requireWritableDb();
  if (row.id !== originalId) {
    const clash = await db.execute({
      sql: `SELECT id FROM ${POSTS_TABLE} WHERE id = ?`,
      args: [row.id],
    });
    if (clash.rows.length > 0) {
      throw new ValidationError(`A post with the slug "${row.id}" already exists.`);
    }
  }
  await db.execute({
    sql: `UPDATE ${POSTS_TABLE}
          SET id = ?, title = ?, date = ?, author = ?, category = ?, description = ?,
              tags = ?, cover = ?, content = ?, published = ?
          WHERE id = ?`,
    args: [row.id, row.title, row.date, row.author, row.category, row.description, row.tags, row.cover, row.content, row.published, originalId],
  });
  const updated = await getAdminPost(row.id);
  if (!updated) throw new Error("Post updated but could not be read back.");
  return updated;
}

export async function deletePost(id: string): Promise<void> {
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new ValidationError("Invalid post id.");
  const db = await requireWritableDb();
  await db.execute({
    sql: `DELETE FROM ${POSTS_TABLE} WHERE id = ?`,
    args: [id],
  });
}

export async function togglePublished(id: string): Promise<boolean> {
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new ValidationError("Invalid post id.");
  const db: Client = await requireWritableDb();
  await db.execute({
    sql: `UPDATE ${POSTS_TABLE} SET published = 1 - published WHERE id = ?`,
    args: [id],
  });
  const result = await db.execute({
    sql: `SELECT published FROM ${POSTS_TABLE} WHERE id = ?`,
    args: [id],
  });
  if (result.rows.length === 0) throw new ValidationError("Post not found.");
  return Number(result.rows[0].published) === 1;
}
