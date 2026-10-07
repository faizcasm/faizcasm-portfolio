import React from 'react';
import Image from 'next/image';
import { resumeData } from '@/data/resumeData';
import heroImage from "@/assets/portfolio-profile.jpeg";
import { Github, Globe, Mail, MapPin, Phone } from 'lucide-react';

type PersonalInfo = typeof resumeData.personalInfo;
type ExperienceItem = (typeof resumeData.experience)[number];
type Project = (typeof resumeData.projects)[number];
type SkillGroup = (typeof resumeData.skillGroups)[number];
type EducationItem = (typeof resumeData.education)[number];
type ProductSection = typeof resumeData.ryuksaidsoProduct;

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({
  title,
  children,
  className = '',
}) => (
  <section className={`mb-6 ${className}`}>
    <h2 className="mb-3 border-b-2 border-blue-500/70 pb-1 text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white">
      {title}
    </h2>
    {children}
  </section>
);

const Bullets: React.FC<{ items: readonly string[] }> = ({ items }) => (
  <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const Header: React.FC<{ personalInfo: PersonalInfo }> = ({ personalInfo }) => (
  <header className="mb-6 flex flex-col items-center gap-5 border-b border-gray-200 pb-6 dark:border-gray-700 md:flex-row md:items-start">
    <div className="relative shrink-0">
      <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 opacity-70 blur" />
      <Image
        src={heroImage}
        alt={personalInfo.name}
        width={160}
        height={200}
        className="relative h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg dark:border-gray-800 md:h-32 md:w-32"
        priority
      />
    </div>

    <div className="text-center md:text-left">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{personalInfo.name}</h1>
      <h2 className="mb-3 text-base font-medium text-blue-600 dark:text-blue-400 md:text-lg">
        {personalInfo.title}
      </h2>

      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-sm text-gray-600 dark:text-gray-300 md:justify-start">
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
  </header>
);

const Skills: React.FC<{ groups: readonly SkillGroup[] }> = ({ groups }) => (
  <Section title="Core Technical Skills">
    <dl className="space-y-2.5">
      {groups.map((group) => (
        <div key={group.category} className="flex flex-col gap-1.5 sm:flex-row sm:gap-3">
          <dt className="w-full shrink-0 text-sm font-semibold text-gray-900 sm:w-32 dark:text-white">
            {group.category}
          </dt>
          <dd className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {item}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  </Section>
);

const Experience: React.FC<{ items: readonly ExperienceItem[] }> = ({ items }) => (
  <Section title="Professional Experience">
    <div className="space-y-5">
      {items.map((item) => (
        <div key={`${item.company}-${item.position}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {item.position}
              <span className="text-blue-600 dark:text-blue-400"> · {item.company}</span>
            </h3>
            {(item.startDate || item.endDate) && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {[item.startDate, item.endDate].filter(Boolean).join(' – ')}
              </p>
            )}
          </div>
          <div className="mt-1.5">
            <Bullets items={item.bullets} />
          </div>
        </div>
      ))}
    </div>
  </Section>
);

/**
 * Mirrors the resume's dedicated "Ryuksaidso | Product & Engineering" section:
 * the live product link, its positioning, and the nine platform pillars.
 */
const RyuksaidsoProduct: React.FC<{ product: ProductSection }> = ({ product }) => (
  <Section title={`${product.name} | ${product.subtitle}`}>
    <p className="mb-1.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
      <a
        href={product.live}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Live product: {product.live.replace("https://", "")}
      </a>
    </p>
    <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
      {product.description}
    </p>
    <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
      {product.pillars.map((pillar) => (
        <li key={pillar.title}>
          <span className="font-semibold text-gray-900 dark:text-white">{pillar.title}:</span>{" "}
          {pillar.detail}
        </li>
      ))}
    </ul>
  </Section>
);

const Projects: React.FC<{ projects: readonly Project[] }> = ({ projects }) => (
  <Section title="Selected Projects">
    <div className="space-y-5">
      {projects.map((project) => (
        <div key={project.name}>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              {project.name}
            </a>
            <span className="font-normal text-gray-500 dark:text-gray-400"> — {project.subtitle}</span>
          </h3>
          <div className="mt-1.5">
            <Bullets items={project.bullets} />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </Section>
);

const Education: React.FC<{ items: readonly EducationItem[] }> = ({ items }) => (
  <Section title="Education">
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.degree} className="flex flex-wrap items-baseline justify-between gap-x-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{item.degree}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{item.institution}</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {[item.startDate, item.endDate].filter(Boolean).join(' – ')}
          </p>
        </div>
      ))}
    </div>
  </Section>
);

const Resume: React.FC = () => {
  return (
    <div
      id="resume"
      className="mx-auto my-6 rounded-2xl border border-gray-200 bg-white p-6 text-black shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white sm:p-8 print:border-0 print:shadow-none"
    >
      <Header personalInfo={resumeData.personalInfo} />

      <Section title="Professional Summary">
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {resumeData.personalInfo.summary}
        </p>
      </Section>

      <Skills groups={resumeData.skillGroups} />
      <Experience items={resumeData.experience} />

      <RyuksaidsoProduct product={resumeData.ryuksaidsoProduct} />

      <div className="mt-6">
        <Projects
          projects={resumeData.projects.filter((project) => project.name !== "Ryuksaidso")}
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Section title="Engineering Highlights" className="mb-0">
          <Bullets items={resumeData.agenticAI} />
        </Section>
        <Section title="Leadership & Open Source" className="mb-0">
          <Bullets items={resumeData.openSource} />
        </Section>
      </div>

      <Education items={resumeData.education} />
    </div>
  );
};

export default Resume;
