"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import type { TrendingRepo } from '@/lib/github';

const GitHubTrends: React.FC = () => {
  const [trendingRepos, setTrendingRepos] = useState<TrendingRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const perPage = 6; // 6 projects per page, 5 pages total for 30 projects

  useEffect(() => {
    const controller = new AbortController();

    const fetchTrendingRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        // Internal route — the token and GitHub cache live server-side.
        const response = await fetch(`/api/github/trending?page=${page}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: { repos: TrendingRepo[]; live: boolean } = await response.json();
        setTrendingRepos(data.repos);
        setLive(data.live);
        if (data.repos.length === 0 && !data.live) {
          setError('GitHub is rate-limiting this network right now. Please try again in a few minutes.');
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError('Failed to fetch trending repositories');
        console.error('Error fetching trending repos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingRepos();
    return () => controller.abort();
  }, [page]);

  if (loading) return <div className="flex justify-center items-center h-64">
    <Loader className="animate-spin text-indigo-500" size={48} />
  </div>;
  if (error) return <div className="text-red-600 dark:text-red-400">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Trending Repositories in Github from last Week</h2>
      {!live && (
        <p className="mb-3 text-xs font-medium text-amber-600 dark:text-amber-400">
          Showing cached data — GitHub is rate-limiting this network.
        </p>
      )}
      <div className="space-y-4">
        {trendingRepos.map((repo) => (
          <div key={repo.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-sm">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {repo.full_name}
            </a>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{repo.description}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs font-semibold rounded">
                {repo.language || 'Unknown'}
              </span>
              {repo.topics.slice(0, 5).map(topic => (
                <span key={topic} className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs font-semibold rounded">
                  {topic}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>⭐ {repo.stargazers_count} stars</span>
              <span>🍴 {repo.forks_count} forks</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-600"
        >
          <ChevronLeft />
        </button>
        <span className="text-gray-800 dark:text-gray-200">Page {page} of 5</span>
        <button
          onClick={() => setPage(p => Math.min(5, p + 1))}
          disabled={page === 5}
          className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-600"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default GitHubTrends;
