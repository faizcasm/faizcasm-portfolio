"use client";

import React from "react";
import { Filter, Search, Tag, X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlogFilterState {
  query: string;
  category: string;
  tag: string;
  year: string;
}

interface BlogFiltersProps {
  categories: string[];
  tags: string[];
  years: string[];
  value: BlogFilterState;
  resultCount: number;
  totalCount: number;
  onChange: (patch: Partial<BlogFilterState>) => void;
  onClear: () => void;
}

const selectClass =
  "rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200";

/**
 * Search, category, tag and year filters for the blog index.
 * Controlled by BlogList so the URL and grid stay in sync.
 */
export default function BlogFilters({
  categories,
  tags,
  years,
  value,
  resultCount,
  totalCount,
  onChange,
  onClear,
}: BlogFiltersProps) {
  const hasFilters =
    value.query !== "" || value.category !== "" || value.tag !== "" || value.year !== "";

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={value.query}
            onChange={(event) => onChange({ query: event.target.value })}
            placeholder="Search posts…"
            aria-label="Search posts"
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Tag size={15} />
            <label htmlFor="tag-filter" className="sr-only">
              Filter by tag
            </label>
            <select
              id="tag-filter"
              value={value.tag}
              onChange={(event) => onChange({ tag: event.target.value })}
              className={selectClass}
            >
              <option value="">All tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </span>

          <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={15} />
            <label htmlFor="year-filter" className="sr-only">
              Filter by year
            </label>
            <select
              id="year-filter"
              value={value.year}
              onChange={(event) => onChange({ year: event.target.value })}
              className={selectClass}
            >
              <option value="">All years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </span>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Filter size={15} />
          </span>
          {["", ...categories].map((category) => (
            <button
              key={category || "all"}
              type="button"
              onClick={() => onChange({ category })}
              aria-pressed={value.category === category}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                value.category === category
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
              )}
            >
              {category || "All"}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <p aria-live="polite">
          Showing {resultCount} of {totalCount}{" "}
          {totalCount === 1 ? "post" : "posts"}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
