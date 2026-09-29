"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Floating back-to-top button (bottom-left so it never collides with
 * the AI chat button on the bottom-right).
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 450);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-4 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-600 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-400"
    >
      <ArrowUp size={20} />
    </button>
  );
}
