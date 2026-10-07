"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Atom,
  Bot,
  Code,
  Container,
  Database,
  Layers,
  Server,
  Sparkles,
} from 'lucide-react';
import { resumeData } from '@/data/resumeData';

interface SkillGroup {
  label: string;
  icon: React.ReactNode;
  items: string[];
}

const iconByCategory: Record<string, React.ReactNode> = {
  Languages: <Code size={14} />,
  Backend: <Server size={14} />,
  Frontend: <Atom size={14} />,
  Data: <Database size={14} />,
  'AI / Agents': <Bot size={14} />,
  'LLM Engineering': <Sparkles size={14} />,
  'Cloud / DevOps': <Container size={14} />,
  Engineering: <Layers size={14} />,
};

const groups: SkillGroup[] = resumeData.skillGroups.map((group) => ({
  label: group.category,
  icon: iconByCategory[group.category] ?? <Code size={14} />,
  items: [...group.items],
}));

const Technologies: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex-grow rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800/90 md:col-span-2 lg:col-span-3">
      <h2 className="mb-1 text-center text-2xl font-bold text-gray-800 dark:text-white">
        Core Technical Skills
      </h2>
      <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
        The stack behind my production backend, distributed systems and agentic AI engineering
      </p>

      <div className="space-y-4">
        {groups.map((group, index) => (
          <motion.div
            key={group.label}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.45,
              delay: reduceMotion ? 0 : index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <span className="text-blue-500 dark:text-blue-400">{group.icon}</span>
              {group.label}
            </p>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item}>
                  <span className="inline-block cursor-default rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-blue-900/50 dark:hover:text-blue-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Technologies;
