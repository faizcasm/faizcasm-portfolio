import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { cache } from "react";
import { getReadyDb, POSTS_TABLE, type PostRow } from "@/lib/db";

// Single data-access boundary for blog posts.
//
// Primary source: SQLite (see src/lib/db.ts) — locally a file at
// data/portfolio.db (auto-seeded from posts/*.md on first access), on Vercel
// a libSQL/Turso database via DATABASE_URL.
// Fallback source: the markdown files in posts/ — used only when no database
// is configured (Vercel without DATABASE_URL) or a query fails, so the public
// blog keeps rendering no matter what.

const postsDirectory = path.join(process.cwd(), "posts");
const imagesDirectory = path.join(process.cwd(), "public", "images");

/** The conventional cover for a post id, when the image actually exists. */
function defaultCover(id: string): string | null {
  const candidate = path.join(imagesDirectory, `${id}.jpg`);
  return fs.existsSync(candidate) ? `/images/${id}.jpg` : null;
}

export interface PostData {
  id: string;
  date: string;
  title: string;
  readTime: string;
  tags: string[];
  category: string;
  description: string;
  author: string;
  cover?: string | null;
}

export interface PostContent extends PostData {
  content: string;
}

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === "string") : [];
  } catch {
    return [];
  }
}

function rowToPost(row: PostRow): PostData {
  return {
    id: row.id,
    date: row.date,
    title: row.title,
    readTime: readingTime(row.content).text,
    tags: parseTags(row.tags),
    category: row.category,
    description: row.description,
    author: row.author,
    cover: row.cover,
  };
}

function sortPosts<T extends { date: string }>(posts: T[]): T[] {
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function normalizeMatter(
  id: string,
  data: Partial<Omit<PostData, "id" | "readTime">>,
  content: string
): PostContent {
  return {
    id,
    content,
    readTime: readingTime(content).text,
    date: data.date ?? "",
    title: data.title ?? id,
    tags: Array.isArray(data.tags) ? data.tags : [],
    category: data.category ?? "",
    description: data.description ?? "",
    author: data.author ?? "",
    cover: data.cover ?? defaultCover(id),
  };
}

// ---------------------------------------------------------------------------
// Markdown fallback (the seed source for the database)
// ---------------------------------------------------------------------------

async function readMarkdownPosts(): Promise<PostContent[]> {
  let fileNames: string[];
  try {
    fileNames = await fsPromises.readdir(postsDirectory);
  } catch {
    return [];
  }
  const allPostsData = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const id = fileName.replace(/\.md$/, "");
        const raw = await fsPromises.readFile(path.join(postsDirectory, fileName), "utf8");
        const { data, content } = matter(raw);
        return normalizeMatter(id, data, content);
      })
  );
  return sortPosts(allPostsData);
}

// ---------------------------------------------------------------------------
// Public API (server-only). Memoized per request with React.cache so a single
// render pass never queries the same data twice.
// ---------------------------------------------------------------------------

export const getSortedPostsData = cache(async (): Promise<PostData[]> => {
  const db = await getReadyDb();
  if (db) {
    try {
      const result = await db.execute(
        `SELECT id, date, title, content, tags, category, description, author, cover
         FROM ${POSTS_TABLE} WHERE published = 1 ORDER BY date DESC`
      );
      // The database is the source of truth once available (it is seeded
      // automatically), so an empty result really means "no published posts".
      return result.rows.map((row) => rowToPost(row as unknown as PostRow));
    } catch (error) {
      console.error("[blog] database read failed, falling back to markdown:", error);
    }
  }
  const posts = await readMarkdownPosts();
  return posts.map(({ content: _content, ...post }) => post);
});

export const getPostData = cache(
  async (id: string): Promise<PostContent | null> => {
    // Reject ids that could escape the data layer before touching any store.
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) return null;

    const db = await getReadyDb();
    if (db) {
      try {
        const result = await db.execute({
          sql: `SELECT * FROM ${POSTS_TABLE} WHERE id = ? AND published = 1`,
          args: [id],
        });
        if (result.rows.length > 0) {
          const row = result.rows[0] as unknown as PostRow;
          return { ...rowToPost(row), content: row.content };
        }
        // Seeded database is authoritative: missing row means not found.
        return null;
      } catch (error) {
        console.error("[blog] database read failed, falling back to markdown:", error);
      }
    }
    return findMarkdownPost(id);
  }
);

async function findMarkdownPost(id: string): Promise<PostContent | null> {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = await fsPromises.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return normalizeMatter(id, data, content);
  } catch {
    return null;
  }
}

export const getAllPostIds = cache(async (): Promise<{ params: { id: string } }[]> => {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({ params: { id: post.id } }));
});

export const getAllTags = cache(async (): Promise<string[]> => {
  const posts = await getSortedPostsData();
  const tags = new Set<string>();
  posts.forEach((post) => {
    (post.tags ?? []).forEach((tag: string) => tags.add(tag));
  });
  return Array.from(tags);
});

export const getAllCategories = cache(async (): Promise<string[]> => {
  const posts = await getSortedPostsData();
  const categories = new Set<string>();
  posts.forEach((post) => {
    if (post.category) categories.add(post.category);
  });
  return Array.from(categories);
});
