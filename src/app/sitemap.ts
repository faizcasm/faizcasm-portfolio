import type { MetadataRoute } from "next";
import { getSortedPostsData } from "../../utils/markdown";

export const revalidate = 3600;

const BASE = "https://faizcasm.me";

/**
 * Dynamic sitemap — blog URLs and dates come from the live post source
 * (SQLite/markdown), so new admin-panel posts are picked up within the hour
 * instead of being missing forever like the old hand-written sitemap.xml.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getSortedPostsData();

  const pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/resume`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/github-stats`, lastModified: new Date(), changeFrequency: "daily", priority: 0.5 },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.id}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...pages, ...postEntries];
}
