"use client";

import React, { useEffect, useMemo, useState } from "react";

export interface LanguageDatum {
  name: string;
  value: number;
}

interface LanguageChart3DProps {
  data: LanguageDatum[];
  /** Index of the slice highlighted on first render (e.g. for static embeds). */
  initialActiveIndex?: number;
}

const PALETTE = [
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ec4899", // pink
  "#64748b", // slate
];

const SIZE = 240;
const CENTER = SIZE / 2;
const R_OUTER = 96;
const R_INNER = 52;
const DEPTH = 16; // extrusion layers
const STEP = 1.6; // px between layers along Z
const TILT = 58; // rotateX degrees

/** Darken a hex colour by `amount` (0 = unchanged, 1 = black). */
function shade(hex: string, amount: number): string {
  const value = parseInt(hex.slice(1), 16);
  const f = 1 - Math.min(1, Math.max(0, amount));
  const r = Math.round(((value >> 16) & 255) * f);
  const g = Math.round(((value >> 8) & 255) * f);
  const b = Math.round((value & 255) * f);
  return `rgb(${r}, ${g}, ${b})`;
}

function polar(radius: number, angleDeg: number): [number, number] {
  const angle = ((angleDeg - 90) * Math.PI) / 180;
  return [CENTER + radius * Math.cos(angle), CENTER + radius * Math.sin(angle)];
}

/** SVG path for a donut sector swept clockwise from `start` to `end` (degrees). */
function sectorPath(start: number, end: number): string {
  const sweep = Math.min(end - start, 359.99);
  const finalEnd = start + sweep;
  const largeArc = sweep > 180 ? 1 : 0;

  const [x1, y1] = polar(R_OUTER, start);
  const [x2, y2] = polar(R_OUTER, finalEnd);
  const [x3, y3] = polar(R_INNER, finalEnd);
  const [x4, y4] = polar(R_INNER, start);

  return [
    `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
    `A ${R_OUTER} ${R_OUTER} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
    `L ${x3.toFixed(2)} ${y3.toFixed(2)}`,
    `A ${R_INNER} ${R_INNER} 0 ${largeArc} 0 ${x4.toFixed(2)} ${y4.toFixed(2)}`,
    "Z",
  ].join(" ");
}

/**
 * A pseudo-3D donut built from stacked SVG layers inside a rotated,
 * `preserve-3d` container. Hovering a slice lifts it out of the disc.
 */
export default function LanguageChart3D({ data, initialActiveIndex }: LanguageChart3DProps) {
  const [active, setActive] = useState<number | null>(initialActiveIndex ?? null);
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Stagger only the entrance; hovering must stay instant afterwards.
    const timer = setTimeout(() => setEntered(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  const segments = useMemo(() => {
    let cursor = 0;
    return data.map((item, index) => {
      const share = total > 0 ? item.value / total : 0;
      const start = cursor;
      const end = cursor + share * 360;
      cursor = end;
      return {
        ...item,
        index,
        start,
        end,
        percent: share * 100,
        color: PALETTE[index % PALETTE.length],
        path: sectorPath(start, Math.max(end, start + 0.01)),
      };
    });
  }, [data, total]);

  if (data.length === 0) return null;

  const activeSegment = active !== null ? segments[active] : null;

  return (
    <div className="w-full">
      <div className="relative mx-auto h-[230px] w-full max-w-[280px]">
        {/* soft shadow beneath the disc */}
        <div className="absolute left-1/2 top-[74%] h-10 w-[78%] -translate-x-1/2 rounded-[50%] bg-black/15 blur-xl dark:bg-black/50" />

        <div
          className="absolute inset-0"
          style={{ perspective: "900px", perspectiveOrigin: "50% 50%", zIndex: 1 }}
        >
          <div
            className="relative h-full w-full transition-transform duration-500"
            style={{
              transform: `rotateX(${TILT}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {segments.map((segment) => (
              <div
                key={segment.name}
                onMouseEnter={() => setActive(segment.index)}
                onMouseLeave={() => setActive((current) => (current === segment.index ? null : current))}
                className="pointer-events-none absolute inset-0"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `translateZ(${active === segment.index ? 22 : mounted ? 0 : -50}px)`,
                  opacity: mounted ? 1 : 0,
                  transition:
                    "transform 400ms cubic-bezier(0.2, 0.7, 0.3, 1), opacity 500ms ease",
                  transitionDelay: entered ? "0ms" : `${segment.index * 70}ms`,
                }}
              >
                {Array.from({ length: DEPTH }).map((_, layer) => {
                  const depth = DEPTH - layer; // render deepest first
                  return (
                    <svg
                      key={depth}
                      viewBox={`0 0 ${SIZE} ${SIZE}`}
                      className="absolute inset-0 h-full w-full"
                      aria-hidden
                      style={{
                        transform: `translateZ(${-depth * STEP}px)`,
                      }}
                    >
                      <path
                        d={segment.path}
                        fill={shade(segment.color, 0.12 + (depth / DEPTH) * 0.66)}
                      />
                    </svg>
                  );
                })}
                {/* top face */}
                <svg
                  viewBox={`0 0 ${SIZE} ${SIZE}`}
                  className="absolute inset-0 h-full w-full"
                  aria-hidden
                >
                  <path
                    d={segment.path}
                    fill={segment.color}
                    className="cursor-pointer"
                    style={{ pointerEvents: "auto" }}
                  />
                  <path
                    d={segment.path}
                    fill="url(#lang-gloss)"
                    className="opacity-40"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <svg width="0" height="0" className="absolute" aria-hidden>
          <defs>
            <linearGradient id="lang-gloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* readable, un-rotated centre label (kept above the 3D layers) */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ zIndex: 2 }}
        >
          {activeSegment ? (
            <div className="flex flex-col items-center rounded-md bg-white/85 px-2.5 py-1 leading-tight shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-gray-900/85 dark:ring-white/10">
              <span className="text-base font-bold text-gray-900 dark:text-white">
                {activeSegment.percent.toFixed(0)}%
              </span>
              <span className="max-w-[92px] truncate text-[11px] font-medium text-gray-500 dark:text-gray-400">
                {activeSegment.name}
              </span>
            </div>
          ) : (
            <>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.length}
              </span>
              <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {data.length === 1 ? "language" : "languages"}
              </span>
            </>
          )}
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-1">
        {segments.map((segment) => (
          <li key={segment.name}>
            <button
              type="button"
              onMouseEnter={() => setActive(segment.index)}
              onMouseLeave={() => setActive((current) => (current === segment.index ? null : current))}
              onFocus={() => setActive(segment.index)}
              onBlur={() => setActive((current) => (current === segment.index ? null : current))}
              className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors ${
                active === segment.index
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {segment.name}
                </span>
              </span>
              <span className="shrink-0 tabular-nums text-gray-500 dark:text-gray-400">
                {segment.percent.toFixed(0)}%
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
