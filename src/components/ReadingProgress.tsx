"use client";

import React, { useEffect, useState } from "react";

/**
 * Thin progress bar pinned above the navbar that fills as the post is read.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const percent = scrollable > 0 ? (scrolled / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, percent)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      className="fixed inset-x-0 top-0 z-[60] h-1 bg-gray-200/60 dark:bg-gray-800/60"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
