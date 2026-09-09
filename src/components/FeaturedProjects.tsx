import React from 'react';
import ProjectCard from './ProjectCard';

export interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
  stars: number;
  forks: number;
  lastUpdated: string;
}

const projects: Omit<ProjectCardProps, 'stars' | 'forks' | 'lastUpdated'>[] = [
  {
    title: "Portfolio",
    description: "A modern portfolio with AI-powered Q&A, refreshed storytelling, and recruiter-focused project presentation.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "LangChain"],
    githubLink: "https://github.com/faizcasm/faizcasm-portfolio",
    liveLink: "https://faizcasm.in"
  },
  {
    title: "Foodify",
    description: "A full-stack food ordering product with robust APIs, practical integrations, and polished UX flows.",
    technologies: ["Next.js", "Prisma", "TypeScript", "Tailwind CSS"],
    githubLink: "https://github.com/faizcasm/Foodify",
    liveLink: "https://foodify-seven.vercel.app"
  }, 
  {title: "Wolvinix",
    description: "Gaming-focused social platform engineered for scale with real-time communication and production-ready backend architecture.",
    technologies: ["Node.js", "React", "MongoDB", "Redis", "WebSockets", "Docker"],
    githubLink: "https://github.com/faizcasm/wolvinix",
    liveLink: "https://wolvinix.com"
  }
];

const ProjectsDisplay: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white/90 shadow-lg dark:border-gray-700 dark:bg-gray-800/90 md:col-span-2 lg:col-span-3">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Projects</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">Recent work across full-stack products and AI-powered experiences</p>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard 
            key={index} 
            {...project} 
            stars={0} 
            forks={0} 
            lastUpdated={new Date().toISOString()}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectsDisplay;
