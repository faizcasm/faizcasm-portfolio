"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, FileQuestion, Tag } from "lucide-react";
import type { PostData } from "../../utils/markdown";
import BlogFilters, { type BlogFilterState } from "./BlogFilters";

interface BlogListProps {
  posts: PostData[];
  categories: string[];
  tags: string[];
  years: string[];
  initialFilters?: Partial<BlogFilterState>;
}

const emptyFilters: BlogFilterState = { query: "", category: "", tag: "", year: "" };

/**
 * Searchable, filterable blog index. Filters also work when deep-linked
 * from a post's tag list (e.g. /blog?tag=Next.js).
 */
export default function BlogList({
  posts,
  categories,
  tags,
  years,
  initialFilters,
}: BlogListProps) {
  const [filters, setFilters] = useState<BlogFilterState>({
    ...emptyFilters,
    ...initialFilters,
  });

  const filteredPosts = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return posts.filter((post) => {
      if (filters.category && post.category !== filters.category) return false;
      if (filters.tag && !(post.tags ?? []).includes(filters.tag)) return false;
      if (filters.year && !post.date.startsWith(filters.year)) return false;
      if (query) {
        const haystack = [post.title, post.description, post.category, ...(post.tags ?? [])]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [posts, filters]);

  const handleChange = (patch: Partial<BlogFilterState>) =>
    setFilters((current) => ({ ...current, ...patch }));

  const handleClear = () => setFilters(emptyFilters);

  if (posts.length === 0) {
    return (
      <p className="py-16 text-center text-gray-500 dark:text-gray-400">
        No posts published yet — check back soon.
      </p>
    );
  }

  return (
    <>
      <BlogFilters
        categories={categories}
        tags={tags}
        years={years}
        value={filters}
        resultCount={filteredPosts.length}
        totalCount={posts.length}
        onChange={handleChange}
        onClear={handleClear}
      />

      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <FileQuestion size={40} className="text-gray-400" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
            No posts match your filters
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try a different search term or clear the filters.
          </p>
          <button
            type="button"
            onClick={handleClear}
            className="mt-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
            >
              <Link href={`/blog/${post.id}`} className="group block h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                  <div className="relative h-48 w-full">
                    {post.cover ? (
                      <Image
                        src={post.cover}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800">
                        <Tag size={32} className="text-blue-400 dark:text-blue-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-grow p-6">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 dark:bg-blue-900/40">
                        {post.category}
                      </span>
                      {(post.tags ?? []).slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {post.title}
                    </h2>
                    <p className="mb-4 flex-grow text-gray-600 dark:text-gray-300">
                      {post.description}
                    </p>
                    <div className="mt-auto flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
