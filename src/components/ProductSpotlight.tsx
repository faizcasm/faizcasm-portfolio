"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Bot,
  CloudCog,
  Database,
  ExternalLink,
  LayoutDashboard,
  Server,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import TiltCard from "./TiltCard";
import { resumeData } from "@/data/resumeData";

/**
 * Lazily-mounted WebGL canvas for the product spotlight. Loaded client-only so
 * the section still renders (and crawls) without WebGL or with reduced motion.
 */
const ProductScene = dynamic(() => import("./ProductScene"), {
  ssr: false,
  loading: () => null,
});

const pillarIcons = [
  LayoutDashboard, // Control Plane
  Server, // API Layer
  Bot, // Agent Runtime
  Workflow, // Async Compute
  Database, // Data Layer
  Sparkles, // LLM Layer
  CloudCog, // Production Infrastructure
  ShieldCheck, // Reliability & Safety
  Activity, // Observability
];

const product = resumeData.ryuksaidsoProduct;
const pillars = product.pillars.map((pillar, index) => ({
  ...pillar,
  Icon: pillarIcons[index % pillarIcons.length],
}));

const ProductSpotlight: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const probe = document.createElement("canvas");
      const supported =
        typeof probe.getContext === "function" &&
        Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
      setWebgl(supported);
    } catch {
      setWebgl(false);
    }
  }, []);

  return (
    <section
      aria-label="Ryuksaidso product and engineering"
      className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 shadow-lg dark:border-gray-700 dark:bg-gray-900/80"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.14),transparent_50%)]" />

      <div className="relative p-5 md:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.name}
                <span className="text-gray-400 dark:text-gray-500"> | </span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  {product.subtitle}
                </span>
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {product.description}
            </p>
          </div>

          <a
            href={product.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Visit product
            <ExternalLink size={15} />
          </a>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
            {pillars.map(({ title, detail, Icon }, index) => (
              <motion.li
                key={title}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: reduceMotion ? 0 : index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group rounded-xl border border-gray-200 bg-white/80 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/70 dark:hover:border-blue-700"
              >
                <p className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <span className="rounded-md bg-blue-50 p-1.5 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/60 dark:text-blue-300 dark:group-hover:bg-blue-600">
                    <Icon size={14} />
                  </span>
                  {title}
                </p>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{detail}</p>
              </motion.li>
            ))}
          </ul>

          <TiltCard maxTilt={5} className="relative min-h-[280px] overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-slate-50 to-blue-50 dark:border-gray-700 dark:from-gray-950 dark:to-gray-900">
            {webgl ? (
              <ProductScene />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_65%)]"
              />
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/90 to-transparent p-3 dark:from-gray-950/90">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Agent control plane
              </p>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
};

export default ProductSpotlight;
