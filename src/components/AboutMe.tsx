import React from 'react';
import Image from 'next/image';
import heroImage from "@/assets/me.jpg";
import { Twitter, GithubIcon, Linkedin } from 'lucide-react';

const AboutMe: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800/90 md:col-span-3 lg:col-span-4">
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <Image
            src={heroImage}
            alt="Faizan profile picture"
            className="h-32 w-32 rounded-full object-cover object-center ring-4 ring-blue-500 shadow-md dark:ring-blue-400"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">Faizan Hameed</h1>
            <p className="mb-4 font-medium text-blue-600 dark:text-blue-400">@faizcasm · AI Engineer</p>
            <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
              I build modern full-stack products and practical AI systems, with a strong focus on agentic workflows that solve real user problems.
              Over the last two years, I have shipped significantly more projects, improved my engineering depth, and matured how I design, build, and scale software.
            </p>
            <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
              Founder of Wolvinix and currently pursuing MCA at KIECAT Srinagar after completing my Bachelor of Computer Applications.
            </p>
            <div className="mb-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {['Agentic Systems', 'AI Integrations', 'Next.js', 'Node.js'].map((skill) => (
                <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="https://twitter.com/faizanhameedtan" target='_blank' className="text-blue-400 hover:text-blue-500 transition-colors duration-300">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://github.com/faizcasm" target='_blank' className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
                <GithubIcon className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/faizan-hameed-a54316255" target='_blank' className="text-blue-700 hover:text-blue-800 transition-colors duration-300">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
