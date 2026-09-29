import React from 'react';
import {
  Atom,
  Bot,
  Code,
  Container,
  Database,
  Gauge,
  Layers,
  Server,
} from 'lucide-react';

interface SkillGroup {
  label: string;
  icon: React.ReactNode;
  items: string[];
}

/** Mirrors the TECHNICAL SKILLS section of the resume. */
const groups: SkillGroup[] = [
  {
    label: 'Languages',
    icon: <Code size={14} />,
    items: ['TypeScript', 'JavaScript', 'SQL'],
  },
  {
    label: 'Frontend',
    icon: <Atom size={14} />,
    items: ['React', 'Next.js', 'Redux', 'Tailwind CSS'],
  },
  {
    label: 'Backend',
    icon: <Server size={14} />,
    items: ['Node.js', 'Express.js', 'NestJS', 'REST APIs', 'WebSockets', 'Microservices'],
  },
  {
    label: 'Data',
    icon: <Database size={14} />,
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'pgvector'],
  },
  {
    label: 'Agentic AI',
    icon: <Bot size={14} />,
    items: ['Agent Loops', 'Tool Calling', 'Planning', 'RAG', 'LangChain', 'LangGraph'],
  },
  {
    label: 'Cloud & DevOps',
    icon: <Container size={14} />,
    items: ['Docker', 'AWS', 'NGINX', 'GitHub Actions', 'CI/CD', 'Linux'],
  },
  {
    label: 'Engineering',
    icon: <Layers size={14} />,
    items: ['System Design', 'Distributed Systems', 'API Design', 'Scalable Infrastructure'],
  },
  {
    label: 'Focus',
    icon: <Gauge size={14} />,
    items: ['Performance', 'Caching', 'Rate Limiting', 'Auth'],
  },
];

const Technologies: React.FC = () => {
  return (
    <div className="flex-grow rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800/90 md:col-span-2 lg:col-span-3">
      <h2 className="mb-1 text-center text-2xl font-bold text-gray-800 dark:text-white">
        Technologies
      </h2>
      <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
        The stack behind my production work and agentic AI engineering
      </p>

      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.label}>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Technologies;
