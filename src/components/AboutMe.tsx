import React from 'react';
import Image from 'next/image';
import heroImage from "@/assets/portfolio-profile.jpeg";
import { Download, Github, Globe, Mail, MapPin, Phone } from 'lucide-react';
import HeroGlow from './HeroGlow';
import HeroScene from './HeroScene';
import { resumeData } from '@/data/resumeData';

const roles = ['Software Engineer', 'Backend & Distributed Systems', 'Full-Stack', 'Agentic AI / LLM Engineering'];

const AboutMe: React.FC = () => {
  const { personalInfo } = resumeData;

  return (
    <section
      aria-label="Introduction"
      className="relative overflow-hidden rounded-3xl border border-gray-200/70 bg-white/90 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/90"
    >
      <HeroGlow />
      <HeroScene />
      <div className="relative p-6 md:p-9">
        <div className="grid items-center gap-6 lg:grid-cols-[auto_1fr]">
          <div className="relative mx-auto lg:mx-0">
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 opacity-80 blur" />
            <Image
              src={heroImage}
              alt={`${personalInfo.name} profile picture`}
              width={220}
              height={275}
              priority
              className="relative h-32 w-32 rounded-full object-cover object-center ring-4 ring-white dark:ring-gray-900 md:h-40 md:w-40"
            />
          </div>

          <div>
            <p className="mb-2 inline-flex rounded-full border border-blue-200/70 bg-blue-50/80 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
              {personalInfo.shortTitle}
            </p>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
              {personalInfo.name}
            </h1>
            <p className="mb-4 flex flex-wrap gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              {roles.map((role) => (
                <span key={role} className="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-800">
                  {role}
                </span>
              ))}
            </p>
            <p className="mb-5 max-w-4xl leading-relaxed text-gray-700 dark:text-gray-300">
              {personalInfo.summary}
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              <a
                href="/Faizan-Hameed-Resume.pdf"
                download="Faizan-Hameed-Resume.pdf"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Download size={16} />
                Download Resume
              </a>
              <a
                href="/resume"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:text-gray-200"
              >
                View Resume Page
              </a>
            </div>

            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-1.5">
                <MapPin size={14} className="text-gray-400" />
                {personalInfo.location}
              </li>
              <li>
                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                  <Mail size={14} className="text-gray-400" />
                  {personalInfo.email}
                </a>
              </li>
              <li>
                <a href={`tel:${personalInfo.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                  <Phone size={14} className="text-gray-400" />
                  {personalInfo.phone}
                </a>
              </li>
              <li>
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                  <Globe size={14} className="text-gray-400" />
                  {personalInfo.website.replace('https://', '')}
                </a>
              </li>
              <li>
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                  <Github size={14} className="text-gray-400" />
                  {personalInfo.github.replace('https://', '')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutMe;
