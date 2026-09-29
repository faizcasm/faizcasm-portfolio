"use client"

import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { GitBranch, User } from 'lucide-react';
import type { Project } from '@/lib/github';

interface ProjectsGridProps {
  projects: Project[];
  /** false when GitHub was unreachable — we show a graceful notice instead of an error box. */
  live: boolean;
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, live }) => {
  const [filter, setFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'own' | 'contributed'>('own');

  const technologies = [
    'All',
    ...Array.from(new Set(projects.flatMap((project) => project.technologies))),
  ];

  const filteredProjects = projects.filter(
    (project) =>
      (filter === 'All' || project.technologies.includes(filter)) &&
      (activeTab === 'own' ? project.isOwn : !project.isOwn)
  );

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200/80 bg-gray-50/80 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/70">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">GitHub Projects</h2>
        <select
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {technologies.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-medium focus:outline-none ${
            activeTab === 'own'
              ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('own')}
        >
          <User className="w-4 h-4 inline-block mr-2" />
          My Projects
        </button>
        <button
          className={`py-2 px-4 font-medium focus:outline-none ${
            activeTab === 'contributed'
              ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('contributed')}
        >
          <GitBranch className="w-4 h-4 inline-block mr-2" />
          Forked Projects
        </button>
      </div>

      {!live && (
        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
          GitHub is rate-limiting this network — the project list may be out of
          date.{' '}
          <a
            href="https://github.com/faizcasm?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Browse repositories on GitHub ↗
          </a>
        </p>
      )}

      {projects.length === 0 ? (
        live ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            No repositories found.
          </div>
        ) : null
      ) : filteredProjects.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          No projects match this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsGrid;
