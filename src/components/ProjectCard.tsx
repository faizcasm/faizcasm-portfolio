import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  technologies,
  githubLink,
  liveLink,
}) => {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white/95 p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/90">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_45%)]" />
      <div className="relative flex h-full flex-col">
        <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="mb-4 flex-grow text-sm leading-relaxed text-gray-700 dark:text-gray-300">{description}</p>
        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span key={index} className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-700/70 dark:text-gray-200">
                {tech}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-3 dark:border-gray-700">
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Github className="mr-1" size={16} />
              <span className="text-sm">GitHub</span>
            </a>
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm font-semibold text-emerald-600 transition-colors duration-300 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <ExternalLink className="mr-1" size={16} />
                <span className="text-sm">Live</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;