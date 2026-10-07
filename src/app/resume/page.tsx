import React from 'react';
import Resume from '@/components/Resume';
import DownloadButton from '@/components/DownloadButton';
import { FileText, ExternalLink } from 'lucide-react';

export const metadata = {
  title: "Resume",
  description:
    "Faizan Hameed — Software Engineer (Backend & Distributed Systems, Full-Stack, Agentic AI / LLM Engineering). Experience, skills, projects and education.",
};

export default function ResumePage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">Resume</h1>
        <p className="mx-auto mb-5 max-w-2xl text-gray-600 dark:text-gray-400">
          The full resume below mirrors the official PDF — experience, technical skills,
          projects and education.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <DownloadButton />
          <a
            href="/Faizan-Hameed-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>
      </header>

      <Resume />

      <section className="mt-10 print:hidden">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <FileText size={20} className="text-blue-500" />
          Original PDF
        </h2>
        <object
          data="/Faizan-Hameed-Resume.pdf"
          type="application/pdf"
          aria-label="Faizan Hameed resume PDF"
          className="h-[75vh] min-h-[560px] w-full rounded-xl border border-gray-200 bg-gray-100 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <p className="p-6 text-sm text-gray-600 dark:text-gray-300">
            Your browser cannot display PDFs inline.{" "}
            <a href="/Faizan-Hameed-Resume.pdf" className="text-blue-600 underline dark:text-blue-400">
              Open the resume PDF
            </a>
            .
          </p>
        </object>
      </section>
    </div>
  );
}
