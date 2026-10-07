import React from 'react';
import { resumeData } from '@/data/resumeData';

const Timeline: React.FC = () => {
  return (
    <section className="mx-auto max-w-6xl rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
        Experience & Education
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Experience</h3>
          <div className="space-y-4">
            {resumeData.experience.map((item) => (
              <article key={`${item.company}-${item.position}`} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    {item.position}
                  </h4>
                  {(item.startDate || item.endDate) && (
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {[item.startDate, item.endDate].filter(Boolean).join(' – ')}
                    </p>
                  )}
                </div>
                <p className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">{item.company}</p>
                <ul className="list-disc space-y-1 pl-4 text-sm text-gray-700 dark:text-gray-300">
                  {item.bullets.slice(0, 2).map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Education</h3>
          <div className="space-y-4">
            {resumeData.education.map((item) => (
              <article key={item.degree} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">{item.degree}</h4>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{item.institution}</p>
                <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  {[item.startDate, item.endDate].filter(Boolean).join(' – ')}
                </p>
                {item.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
