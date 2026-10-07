"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, GraduationCap, Rocket } from "lucide-react";
import { resumeData } from "@/data/resumeData";

type ExperienceItem = (typeof resumeData.experience)[number];
type EducationItem = (typeof resumeData.education)[number];

const EASE = [0.22, 1, 0.36, 1] as const;

/** Vertical gradient rail that runs behind the markers of a timeline column. */
const Rail: React.FC = () => (
  <span
    aria-hidden="true"
    className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-blue-500 via-indigo-400 to-purple-400 opacity-60 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500"
  />
);

const TimelineCard: React.FC<{
  index: number;
  reduceMotion: boolean;
  accent: "blue" | "violet";
  heading: React.ReactNode;
  meta?: React.ReactNode;
  children: React.ReactNode;
}> = ({ index, reduceMotion, accent, heading, meta, children }) => (
  <motion.article
    initial={reduceMotion ? false : { opacity: 0, x: -18 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.08, ease: EASE }}
    className="group relative"
  >
    <span
      aria-hidden="true"
      className={`absolute -left-[15px] top-5 h-3 w-3 rounded-full border-2 border-white shadow-md transition-transform duration-300 group-hover:scale-125 dark:border-gray-900 ${
        accent === "blue"
          ? "bg-blue-500 ring-4 ring-blue-500/20"
          : "bg-violet-500 ring-4 ring-violet-500/20"
      }`}
    />
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-base font-semibold text-gray-900 dark:text-white">{heading}</h4>
        {meta}
      </div>
      {children}
    </div>
  </motion.article>
);

const Timeline: React.FC = () => {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <section
      aria-label="Experience and education"
      className="mx-auto max-w-6xl rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80"
    >
      <div className="mb-7 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Experience & Education</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          The path from full-stack intern to founder &amp; lead AI engineer
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
            <Rocket size={18} className="text-blue-500" />
            Experience
          </h3>
          <div className="relative space-y-4 pl-6">
            <Rail />
            {resumeData.experience.map((item: ExperienceItem, index) => (
              <TimelineCard
                key={`${item.company}-${item.position}`}
                index={index}
                reduceMotion={reduceMotion}
                accent="blue"
                heading={item.position}
                meta={
                  (item.startDate || item.endDate) && (
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
                    </p>
                  )
                }
              >
                <p className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                  {item.company}
                </p>
                <ul className="list-disc space-y-1 pl-4 text-sm text-gray-700 dark:text-gray-300">
                  {item.bullets.slice(0, 2).map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                {item.bullets.length > 2 && (
                  <Link
                    href="/resume"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    +{item.bullets.length - 2} more in the full resume
                    <ArrowRight size={12} />
                  </Link>
                )}
              </TimelineCard>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
            <GraduationCap size={18} className="text-violet-500" />
            Education
          </h3>
          <div className="relative space-y-4 pl-6">
            <Rail />
            {resumeData.education.map((item: EducationItem, index) => (
              <TimelineCard
                key={item.degree}
                index={index}
                reduceMotion={reduceMotion}
                accent="violet"
                heading={item.degree}
                meta={
                  (item.startDate || item.endDate) && (
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
                    </p>
                  )
                }
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">{item.institution}</p>
                {item.description && (
                  <p className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {item.description}
                  </p>
                )}
              </TimelineCard>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Full details, skills and projects
            </p>
            <Link
              href="/resume"
              className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View the resume page
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
