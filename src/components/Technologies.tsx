import React from 'react';
import { 
  Code, 
  FileJson, 
  Atom, 
  Zap, 
  Palette, 
  Globe, 
  BarChart, 
  Server, 
  FileCode, 
  Database, 
  Table, 
  GitBranch, 
  Github, 
  GitCommit, 
  Container, 
  Terminal, 
  Rocket, 
  Bot, 
  Link
} from 'lucide-react';

const skills = [
  { icon: <Code />, name: "JavaScript" },
  { icon: <FileJson />, name: "TypeScript" },
  { icon: <Atom />, name: "React" },
  { icon: <Zap />, name: "Next.js" },
  { icon: <Palette />, name: "Tailwind CSS" },
  { icon: <Globe />, name: "REST APIs" },
  { icon: <BarChart />, name: "System Design" },
  { icon: <Server />, name: "Node.js" },
  { icon: <FileCode />, name: "Python" },
  { icon: <Database />, name: "MongoDB" },
  { icon: <Table />, name: "PostgreSQL" },
  { icon: <GitBranch />, name: "Prisma" },
  { icon: <GitCommit />, name: "Git" },
  { icon: <Github />, name: "GitHub" },
  { icon: <Container />, name: "Docker" },
  { icon: <Terminal />, name: "CI/CD" },
  { icon: <Rocket />, name: "Redis" },
  { icon: <Bot />, name: "OpenAI" },
  { icon: <Link />, name: "LangChain" },
  { icon: <Bot />, name: "Agentic Systems" },
];

const Technologies: React.FC = () => {
  return (
    <div className="flex-grow rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800/90 md:col-span-2 lg:col-span-3">
      <h2 className="mb-2 text-center text-2xl font-bold text-gray-800 dark:text-white">Technologies</h2>
      <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">Modern full-stack and AI tooling used in recent projects</p>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {skills.map((skill, index) => (
          <li 
            key={index}
            className="flex flex-col items-center p-4 rounded-lg bg-gray-100 dark:bg-gray-700 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105 transform"
          >
            <div className="text-gray-600 dark:text-gray-300 mb-2">
              {React.cloneElement(skill.icon, { size: 24 })}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{skill.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Technologies;