"use client";

import React, { useCallback, useRef, useState } from "react";

/**
 * 3D perspective tilt: the card follows the pointer with rotateX/rotateY and a
 * highlight that tracks the cursor. Resets smoothly on pointer leave.
 * Falls back to a plain wrapper for touch devices and reduced-motion users.
 */
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}> = ({ children, className = "", maxTilt = 7 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
    transformStyle: "preserve-3d",
    transition: "transform 400ms cubic-bezier(0.2, 0.7, 0.3, 1)",
  });
  const [glow, setGlow] = useState<string | null>(null);

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== "mouse") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setStyle({
          transform: `perspective(1000px) rotateX(${(0.5 - py) * maxTilt * 2}deg) rotateY(${
            (px - 0.5) * maxTilt * 2
          }deg) translateZ(6px)`,
          transformStyle: "preserve-3d",
          transition: "transform 80ms linear",
        });
        setGlow(
          `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, rgba(59,130,246,0.18), transparent 65%)`
        );
      });
    },
    [maxTilt]
  );

  const handleLeave = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
      transformStyle: "preserve-3d",
      transition: "transform 500ms cubic-bezier(0.2, 0.7, 0.3, 1)",
    });
    setGlow(null);
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={className}
      style={style}
    >
      {glow && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-xl"
          style={{ background: glow }}
        />
      )}
      {children}
    </div>
  );
};

export default TiltCard;
