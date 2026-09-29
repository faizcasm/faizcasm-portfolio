import { isValidElement, type ReactNode } from "react";

export interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * Turns a heading's text into a URL-friendly anchor id.
 * Keeps unicode letters/numbers, drops emoji and punctuation.
 */
export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    // strip markdown emphasis/code markers so rendered and raw text match
    .replace(/[`*_~]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "section";
}

/** Extracts plain text from a React node tree (used for rendered headings). */
export function nodeText(children: ReactNode): string {
  if (children === null || children === undefined || typeof children === "boolean") {
    return "";
  }
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(nodeText).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return nodeText(children.props.children);
  }
  return "";
}

/**
 * Extracts headings from raw markdown for the table of contents.
 * Fenced code blocks are ignored, and duplicate headings get unique ids.
 */
export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  let inFence = false;

  for (const line of content.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> label
      .trim();
    if (!text) continue;

    let id = slugify(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;

    headings.push({ id, text, level: match[1].length });
  }

  return headings;
}

/**
 * Picks the headings worth showing in the table of contents.
 * Prefers nested sections (h2+) and only falls back to h1 for flat posts.
 */
export function getTocHeadings(headings: Heading[]): Heading[] {
  const nested = headings.filter((heading) => heading.level >= 2);
  return nested.length > 0 ? nested : headings;
}
