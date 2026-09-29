"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/headings";

interface TableOfContentsProps {
  headings: Heading[];
  /** "sidebar" renders inline (use inside a sticky wrapper), "disclosure" renders a collapsible block for small screens. */
  variant?: "sidebar" | "disclosure";
}

/**
 * Sticky "On this page" navigation. Highlights the section currently
 * being read and smooth-scrolls on click.
 */
export default function TableOfContents({ headings, variant = "sidebar" }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const update = () => {
      const offset = 120; // clears the sticky navbar
      let current = headings[0].id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= offset) {
          current = heading.id;
        }
      }

      // Once the bottom is reached, mark the last section as active.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) current = headings[headings.length - 1].id;

      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headings]);

  if (headings.length < 2) return null;

  const minLevel = Math.min(...headings.map((heading) => heading.level));

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    const element = document.getElementById(id);
    if (!element) return;
    event.preventDefault();
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  };

  const nav = (
    <nav aria-label="Table of contents">
      {variant === "sidebar" && (
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          <List size={14} />
          On this page
        </p>
      )}
      <ul className="mt-3 space-y-0.5 border-l border-gray-200 dark:border-gray-700">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(event) => handleClick(event, heading.id)}
                aria-current={isActive ? "true" : undefined}
                style={{ paddingLeft: `${(heading.level - minLevel) * 12 + 12}px` }}
                className={cn(
                  "-ml-px block border-l-2 py-1 pr-2 text-sm leading-snug transition-colors",
                  isActive
                    ? "border-blue-600 font-medium text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  if (variant === "disclosure") {
    return (
      <details className="rounded-lg border border-gray-200 bg-white/60 p-4 dark:border-gray-700 dark:bg-gray-800/60 lg:hidden">
        <summary className="group flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 [&::-webkit-details-marker]:hidden dark:text-gray-400">
          <span className="flex items-center gap-2">
            <List size={14} />
            Table of contents
          </span>
          <ChevronDown
            size={16}
            className="transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="mt-3">{nav}</div>
      </details>
    );
  }

  return nav;
}
