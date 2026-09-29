"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * Printing while the dark theme is active produced white-on-white output
 * (dark backgrounds printed with the browser's default white paper and the
 * dark-mode text stayed light). Force the light theme for the duration of
 * the print, then restore whatever the visitor had chosen.
 *
 * Renders nothing.
 */
export default function PrintThemeSync() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    let restoreTo: string | null = null;

    const beforePrint = () => {
      restoreTo = theme ?? null;
      if (resolvedTheme === "dark") setTheme("light");
    };

    const afterPrint = () => {
      if (restoreTo) {
        setTheme(restoreTo);
        restoreTo = null;
      }
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, [theme, resolvedTheme, setTheme]);

  return null;
}
