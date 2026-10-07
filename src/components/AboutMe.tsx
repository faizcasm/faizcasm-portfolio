import React from 'react';
import Image from 'next/image';
import heroImage from "@/assets/portfolio-profile.jpeg";
import { Twitter, GithubIcon, Linkedin, MapPin } from 'lucide-react';
import HeroGlow from './HeroGlow';
import HeroScene from './HeroScene';

const roles = ['Software Engineer', 'Backend & Distributed Systems', 'Full-Stack', 'Agentic AI / LLM Engineering'];

const skills = [
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'Redis',
  'Docker',
  'AWS',
  'React / Next.js',
  'Agentic AI',
  'System Design',
  'Observability',
];

const AboutMe: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800/90 md:col-span-3 lg:col-span-4">
      <HeroGlow />
      <HeroScene />
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative shrink-0">
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 opacity-70 blur" />
            <Image
              src={heroImage}
              alt="Faizan Hameed profile picture"
              width={220}
              height={275}
              priority
              className="relative h-32 w-32 rounded-full object-cover object-center ring-4 ring-white dark:ring-gray-800"
            />
            <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white dark:border-gray-800">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">Faizan Hameed</h1>
            <p className="mb-1 font-medium text-blue-600 dark:text-blue-400">@faizcasm</p>
            <p className="mb-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-base font-semibold text-gray-800 sm:justify-start dark:text-gray-100">
              {roles.map((role, index) => (
                <React.Fragment key={role}>
                  {index > 0 && (
                    <span className="text-gray-300 dark:text-gray-500" aria-hidden>
                      |
                    </span>
                  )}
                  <span>{role}</span>
                </React.Fragment>
              ))}
            </p>

            <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
              <strong>5 years of development experience</strong> building backend systems, full-stack
              products, distributed services, real-time platforms and production AI systems — strong in
              TypeScript, Node.js, PostgreSQL, Redis, Docker, AWS, React and Next.js. I design agentic
              systems for planning, tool calling, RAG, memory, structured outputs, human-in-the-loop
              controls, evaluation, observability, retries and long-running execution.
            </p>
            <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
              Founder &amp; lead engineer of <strong>Ryuksaidso</strong>, a production-oriented agent
              reliability and control-plane platform, and creator of{" "}
              <strong>BackendOS</strong>, an open-source backend toolkit. Currently pursuing{" "}
              <strong>MCA at NIELIT Srinagar</strong> after completing my BCA at Punjab Technical University.
            </p>

            <div className="mb-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 dark:ring-blue-800 dark:hover:bg-blue-900/70"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 sm:justify-start">
              <a
                href="https://twitter.com/faizanhameedtan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="text-blue-400 transition-colors duration-300 hover:text-blue-500"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/faizcasm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-gray-700 transition-colors duration-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <GithubIcon className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/faizan-hameed-tantray-a54316255"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-blue-700 transition-colors duration-300 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <span className="hidden items-center text-sm text-gray-500 dark:text-gray-400 sm:flex">
                <MapPin size={14} className="mr-1" />
                Jammu &amp; Kashmir, India
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
