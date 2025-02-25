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
    description: "A Portfolio Website with an AI chatbot that can answer any question about you.",
    technologies: ["Next.js", "MongoDB", "Stripe", "tailwind"],
    githubLink: "https://github.com/faizcasm/faizcasm-portfolio",
    liveLink: "https://faizcasm.in"
  },
  {
    title: "Foodify",
    description: "Full Stack Food delivery App",
    technologies: ["Nodejs", "React", "Tailwind CSS"],
    githubLink: "https://github.com/faizcasm/Foodify",
    liveLink: "https://foodify-seven.vercel.app"
  }, 
  {title: "Wolvinix",
    description: "Full Stack social media platform for gamers",
    technologies: ["Nodejs", "React", "Tailwind CSS","MongoDb","Cron","Postgres","WebRTC","WebSockets","Industry ready"],
    githubLink: "https://github.com/faizcasm/wolvinix",
    liveLink: "https://wolvinix.com"
  }
];

const ProjectsDisplay: React.FC = () => {
  return (
    <div className="rounded-lg shadow-md md:col-span-2 lg:col-span-3">
      <div className="p-4">
        <h2 className="text-xl font-bold">Featured Projects</h2>
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
