import React from 'react';
import { resumeData } from '@/data/resumeData';

const Languages: React.FC = () => {
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800/90">
      <h2 className="mb-3 text-2xl font-bold text-gray-800 dark:text-white">Engineering Highlights</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {resumeData.agenticAI.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

export default Languages;
