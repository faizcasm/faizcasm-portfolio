"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Soft spotlight that follows the cursor across the hero card,
 * plus a slow ambient gradient blob behind it.
 */
export default function HeroGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [spot, setSpot] = useState({ x: 30, y: 25 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();

      // Ignore moves far away from the card to avoid needless renders.
      if (
        event.clientX < rect.left - 150 ||
        event.clientX > rect.right + 150 ||
        event.clientY < rect.top - 150 ||
        event.clientY > rect.bottom + 150
      ) {
        return;
      }

      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setSpot({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <div className="absolute -left-24 -top-24 h-64 w-64 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/20" />
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(360px circle at ${spot.x}% ${spot.y}%, rgba(59,130,246,0.16), transparent 65%)`,
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-indigo-500/10 to-transparent dark:from-indigo-500/5" />
    </div>
  );
}
