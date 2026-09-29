"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CornerDownLeft,
  FileText,
  Home,
  Layers,
  Search,
  Settings,
} from "lucide-react";
import projectsData from "../../data.json";

export interface PalettePost {
  id: string;
  title: string;
  category: string;
}

interface PaletteEntry {
  label: string;
  group: string;
  href: string;
  hint?: string;
}

const PAGE_ENTRIES: PaletteEntry[] = [
  { label: "Home", group: "Pages", href: "/", hint: "Overview" },
  { label: "Projects", group: "Pages", href: "/projects", hint: "Selected work" },
  { label: "Blog", group: "Pages", href: "/blog", hint: "Insights & thoughts" },
  { label: "GitHub Insights", group: "Pages", href: "/github-stats", hint: "Charts" },
  { label: "Resume", group: "Pages", href: "/resume", hint: "PDF + HTML" },
];

const projectEntries: PaletteEntry[] = (projectsData.featuredProjects ?? []).map(
  (project) => ({
    label: project.title,
    group: "Projects",
    href: project.liveDemo || project.githubLink || "/projects",
    hint: project.technologies.slice(0, 2).join(", "),
  })
);

const groupIcon = (group: string) => {
  switch (group) {
    case "Pages":
      return Home;
    case "Projects":
      return Briefcase;
    case "Blog posts":
      return BookOpen;
    default:
      return FileText;
  }
};

interface CommandPaletteProps {
  posts: PalettePost[];
}

/**
 * Spotlight-style command menu (⌘K / Ctrl+K) for jumping anywhere
 * on the site: pages, projects and blog posts.
 */
export default function CommandPalette({ posts }: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [isMac, setIsMac] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const entries = useMemo<PaletteEntry[]>(() => {
    const postEntries: PaletteEntry[] = posts.map((post) => ({
      label: post.title,
      group: "Blog posts",
      href: `/blog/${post.id}`,
      hint: post.category,
    }));
    return [...PAGE_ENTRIES, ...projectEntries, ...postEntries];
  }, [posts]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((entry) =>
      `${entry.label} ${entry.group} ${entry.hint ?? ""}`.toLowerCase().includes(needle)
    );
  }, [entries, query]);

  useEffect(() => {
    setIsMac(/mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent));
  }, []);

  // Global shortcut + escape handling.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Reset state and lock scrolling whenever the palette opens.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Keep the highlighted row in view.
  useEffect(() => {
    const element = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    element?.scrollIntoView({ block: "nearest" });
  }, [active, results.length]);

  const navigate = (entry: PaletteEntry) => {
    setOpen(false);
    if (/^https?:\/\//.test(entry.href)) {
      window.open(entry.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(entry.href);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (results.length ? (current + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) =>
        results.length ? (current - 1 + results.length) % results.length : 0
      );
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      navigate(results[active]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command menu"
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/70 px-2.5 py-1.5 text-sm text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:text-blue-400"
      >
        <Search size={15} />
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 md:inline dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command menu"
        >
          <div
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-700">
              <Search size={16} className="shrink-0 text-gray-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search pages, projects and posts…"
                className="w-full bg-transparent py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white"
              />
              <kbd className="shrink-0 rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                esc
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No results for “{query}”
                </p>
              ) : (
                results.map((entry, index) => {
                  const showHeader = entry.group !== results[index - 1]?.group;
                  const Icon = groupIcon(entry.group);
                  const isActive = index === active;

                  return (
                    <React.Fragment key={`${entry.group}-${entry.label}`}>
                      {showHeader && (
                        <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                          {entry.group}
                        </p>
                      )}
                      <button
                        type="button"
                        data-index={index}
                        onMouseEnter={() => setActive(index)}
                        onClick={() => navigate(entry)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        }`}
                      >
                        <Icon size={16} className={isActive ? "text-white" : "text-gray-400"} />
                        <span className="min-w-0 flex-1 truncate font-medium">{entry.label}</span>
                        {entry.hint && (
                          <span
                            className={`hidden shrink-0 truncate text-xs sm:block ${
                              isActive ? "text-blue-100" : "text-gray-400 dark:text-gray-500"
                            }`}
                          >
                            {entry.hint}
                          </span>
                        )}
                        {isActive &&
                          (/^https?:\/\//.test(entry.href) ? (
                            <ArrowUpRight size={15} className="shrink-0 text-white" />
                          ) : (
                            <CornerDownLeft size={15} className="shrink-0 text-white" />
                          ))}
                      </button>
                    </React.Fragment>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2.5 text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500">
              <span className="flex items-center gap-1.5">
                <Settings size={12} />
                ↑↓ navigate · ↵ open · esc close
              </span>
              <span className="flex items-center gap-1.5">
                <Layers size={12} />
                {results.length} result{results.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
