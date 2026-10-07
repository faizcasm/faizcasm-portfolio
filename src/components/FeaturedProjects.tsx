import React from 'react';
import ProjectCard from './ProjectCard';
import TiltCard from './TiltCard';

export interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
}

const projects: ProjectCardProps[] = [
  {
    title: "Ryuksaidso",
    description:
      "Production-oriented agent reliability and control-plane platform: planning, tracing, approvals, evaluations, versioning, knowledge retrieval and multi-provider failover.",
    technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker", "AWS"],
    githubLink: "https://github.com/faizcasm",
    liveLink: "https://ryuksaidso.online"
  },
  {
    title: "Wolvinix",
    description:
      "Real-time gaming social platform engineered for scale with WebSockets, Redis-backed services, authentication and Dockerized backend infrastructure.",
    technologies: ["React", "TypeScript", "Node.js", "WebSockets", "Redis", "PostgreSQL", "Docker"],
    githubLink: "https://github.com/faizcasm/wolvinix",
    liveLink: "https://wolvinix.com"
  },
  {
    title: "BackendOS",
    description:
      "Open-source backend framework of reusable production-oriented primitives covering authentication, API architecture, middleware and database integration.",
    technologies: ["TypeScript", "Node.js", "Express.js", "PostgreSQL", "REST APIs"],
    githubLink: "https://github.com/faizcasm/BackendOS",
    liveLink: "https://github.com/faizcasm/BackendOS"
  },
  {
    title: "Portfolio",
    description:
      "This site: Next.js App Router, dynamic admin-backed blog, server-side GitHub integration, 3D visuals and a resume that mirrors the official PDF.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Three.js"],
    githubLink: "https://github.com/faizcasm/faizcasm-portfolio",
    liveLink: "https://faizcasm.me"
  }
];

const ProjectsDisplay: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white/90 shadow-lg dark:border-gray-700 dark:bg-gray-800/90 md:col-span-2 lg:col-span-3">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Projects</h2>
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
