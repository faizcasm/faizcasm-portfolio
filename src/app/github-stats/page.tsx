import GitHubInsightsCharts from '@/components/GitHubInsightsCharts';
import GitHubTrends from '@/components/GitHubTrends';
import React from 'react';
import { getInsightsSnapshot } from '@/lib/github';

export const revalidate = 3600;

export const metadata = {
  title: "GitHub Statistics and Insights",
  description:
    "GitHub language trends, top repositories and insights for the developer ecosystem.",
};

const GitHubStatsPage: React.FC = async () => {
  const insights = await getInsightsSnapshot();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">GitHub Statistics and Insights</h1>

      <div className="mb-8">
        <GitHubInsightsCharts data={insights} />
      </div>

      <div>
        <GitHubTrends />
      </div>
    </div>
  );
};

export default GitHubStatsPage;
