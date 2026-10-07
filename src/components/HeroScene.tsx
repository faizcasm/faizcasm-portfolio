"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * SSR-safe shell for the WebGL hero backdrop. The canvas is loaded lazily on
 * the client only, so the page still renders (and crawls) without WebGL.
 */
const HeroSceneCanvas = dynamic(() => import("./HeroSceneCanvas"), {
  ssr: false,
  loading: () => null,
});

const HeroScene: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    try {
      const probe = document.createElement("canvas");
      const supported =
        typeof probe.getContext === "function" &&
        Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
      setEnabled(supported);
    } catch {
      setEnabled(false);
    }
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(95%_130%_at_80%_50%,black_30%,transparent_82%)] dark:opacity-70 ${className}`}
    >
      <HeroSceneCanvas />
    </div>
  );
};

export default HeroScene;
