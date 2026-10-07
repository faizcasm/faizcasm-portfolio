import React from 'react';

interface TimelineItem {
  type: 'education' | 'experience';
  title: string;
  organization: string;
  date?: string;
  location?: string;
  description?: string;
  skills?: string[];
}

const educationItems: TimelineItem[] = [
  {
    type: 'education',
    title: 'Master of Computer Applications (MCA)',
    organization: 'NIELIT Srinagar',
    date: 'Currently Pursuing',
    description: 'National Institute of Electronics & Information Technology. Currently pursuing postgraduate studies with focus on advanced software engineering and computing.',
    skills: ['Advanced Computing', 'Software Architecture', 'Research Mindset']
  },
  {
    type: 'education',
    title: 'Bachelor of Computer Applications (BCA)',
    organization: 'Punjab Technical University',
    date: '2023 - 2026',
    description: 'Completed. Built a strong base in full-stack development, databases, and software fundamentals.',
    skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'System Design']
  },
  {
    type: 'education',
    title: '12th class',
    organization: 'Govt. Higher Secondary School Palhallan',
    date: 'March 2021 - May 2023',
    description: '',
  }
];

const experienceItems: TimelineItem[] = [
  {
    type: 'experience',
    title: 'Founder & Lead Software / AI Engineer',
    organization: 'Ryuksaidso',
    date: '2026 - Present',
    location: 'Remote',
    description:
      'Agent reliability and control-plane platform: control plane, agent runtime, Redis + BullMQ async execution, PostgreSQL/Prisma + pgvector, multi-provider LLM routing, Dockerized AWS EC2 infrastructure and observability.',
    skills: ['TypeScript', 'Node.js', 'BullMQ', 'pgvector', 'RBAC', 'Observability']
  },
  {
    type: 'experience',
    title: 'Full Stack Engineer',
    organization: 'Locrave',
    date: 'Dec 2025 - Apr 2026',
    location: 'Remote',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs']
  },
  {
    type: 'experience',
    title: 'Founder & Lead Backend Engineer',
    organization: 'Wolvinix',
    date: '2024 - 2025',
    location: 'Remote',
    skills: ['System Design', 'Node.js', 'TypeScript', 'WebSockets', 'Redis', 'Docker']
  },
  {
    type: 'experience',
    title: 'Backend Developer Intern',
    organization: 'Arcnet IT Solutions',
    location: 'Remote',
    skills: ['Backend APIs', 'Database Integration', 'Query Optimization', 'Reliability']
  },
  {
    type: 'experience',
    title: 'Full Stack Intern',
    organization: 'Upskill Mafia',
    date: 'Aug 2023 - Feb 2024',
    location: 'Remote',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'React', 'Authentication']
  }
];

const TimelineItem: React.FC<{ item: TimelineItem }> = ({ item }) => (
  <div className="mb-8 relative">
    <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500" />
    <div className="ml-6 rounded-xl border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="absolute left-0 top-4 h-5 w-5 rounded-full border-4 border-white bg-blue-500 dark:border-gray-800" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{item.organization}</p>
      {item.date && <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>}
      {item.location && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.location}</p>
      )}
      {item.description && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
      )}
      {item.skills && (
        <div className="mt-2 flex flex-wrap gap-2">
          {item.skills.map((skill, index) => (
            <span key={index} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

const Timeline: React.FC = () => {
  return (
    <div className="mx-auto max-w-6xl rounded-2xl border border-gray-200/80 bg-gray-50/80 p-5 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/70">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">Education & Experience</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Experience</h2>
          {experienceItems.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Education</h2>
          {educationItems.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;