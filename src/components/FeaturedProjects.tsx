import React from 'react';
import ProjectCard from './ProjectCard';
import TiltCard from './TiltCard';
import { resumeData } from '@/data/resumeData';

export interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
}

const projects: ProjectCardProps[] = resumeData.projects.map((project) => ({
  title: project.name,
  description: project.bullets.join(' '),
  technologies: [...project.technologies],
  githubLink: project.repo,
  liveLink: project.link,
}));

const ProjectsDisplay: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white/90 shadow-lg dark:border-gray-700 dark:bg-gray-800/90 md:col-span-2 lg:col-span-3">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Selected Projects</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Production systems across agentic AI, real-time products and open-source tooling
        </p>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        {projects.map((project) => (
          <TiltCard key={project.title} className="relative h-full" maxTilt={6}>
            <ProjectCard {...project} />
          </TiltCard>
        ))}
      </div>
    </div>
  );
}

export default ProjectsDisplay;
