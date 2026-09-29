"use client"

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Star, GithubIcon } from 'lucide-react';
import LanguageChart3D from './LanguageChart3D';
import type { InsightsSnapshot } from '@/lib/github';

interface GitHubInsightsChartsProps {
  data: InsightsSnapshot;
}

/**
 * Charts render from a snapshot fetched and cached on the server
 * (src/lib/github.ts) — no unauthenticated search-API calls from the browser.
 */
const GitHubInsightsCharts: React.FC<GitHubInsightsChartsProps> = ({ data }) => {
  const { languages, topRepos, live } = data;

  if (!live && languages.length === 0 && topRepos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
          <GithubIcon className="mr-2" /> GitHub Insights
        </h2>
        <p className="text-amber-600 dark:text-amber-400 text-sm">
          GitHub is rate-limiting this network right now, so the charts are
          temporarily unavailable. Refresh a bit later to see them.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
        <GithubIcon className="mr-2" /> GitHub Insights
      </h2>
      {!live && (
        <p className="mb-3 text-xs font-medium text-amber-600 dark:text-amber-400">
          Showing cached data — GitHub is rate-limiting this network.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Top Languages</h3>
          <LanguageChart3D data={languages} />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200 flex items-center">
            <Star className="mr-2" /> Top Repositories by Stars
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topRepos}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stars" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>These charts provide insights into popular languages and top repositories</p>
        <p>Data is based on public GitHub information and is updated periodically.</p>
      </div>
    </div>
  );
};

export default GitHubInsightsCharts;
