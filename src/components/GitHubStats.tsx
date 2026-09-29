'use client'

import React, { useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import Image from 'next/image';
import { Loader, ExternalLink } from 'lucide-react';
import LanguageChart3D, { type LanguageDatum } from './LanguageChart3D';

interface UserData {
  login: string;
  name: string | null;
  avatar_url: string;
  created_at: string;
}

const octokit = new Octokit({ auth: process.env.GITHUB_SECRET });

/**
 * Snapshot of the public-repo language distribution, used only when the
 * GitHub API is rate-limited so the chart never renders as an error box.
 * Captured from github.com/faizcasm — live data replaces it as soon as
 * the API responds again.
 */
const FALLBACK_LANGUAGES: LanguageDatum[] = [
  { name: 'JavaScript', value: 19 },
  { name: 'TypeScript', value: 10 },
  { name: 'Python', value: 2 },
  { name: 'Java', value: 1 },
  { name: 'Shell', value: 1 },
  { name: 'HTML', value: 1 },
];

const FALLBACK_AVATAR = 'https://avatars.githubusercontent.com/u/138277686?v=4';

/**
 * GitHub card: profile identity + an interactive 3D breakdown of the
 * languages used across public repositories.
 */
const GitHubStats: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [languages, setLanguages] = useState<LanguageDatum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snapshot, setSnapshot] = useState<boolean>(false);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const userResponse = await octokit.users.getByUsername({ username: 'faizcasm' });
        setUserData(userResponse.data as UserData);

        const reposResponse = await octokit.repos.listForUser({ username: 'faizcasm', per_page: 100 });

        const languageCounts: { [key: string]: number } = {};
        reposResponse.data.forEach((repo) => {
          if (repo.language) {
            languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
          }
        });

        setLanguages(
          Object.entries(languageCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6)
        );
      } catch (err) {
        // Rate limited (or offline): fall back to the last captured
        // snapshot so the card still shows a real breakdown.
        console.error('Error fetching GitHub data:', err);
        setLanguages(FALLBACK_LANGUAGES);
        setSnapshot(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 rounded-2xl border border-gray-200/80 bg-white/90 shadow-lg dark:border-gray-700 dark:bg-gray-800/90">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );

  return (
    <div className="flex-grow rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800/90">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={userData?.avatar_url ?? FALLBACK_AVATAR}
            alt={`${userData?.login ?? 'faizcasm'} GitHub avatar`}
            width={48}
            height={48}
            unoptimized
            className="h-12 w-12 rounded-full ring-2 ring-blue-500/60"
          />
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-gray-900 dark:text-white">
              {userData?.name || 'Faizan Hameed'}
            </p>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              @{userData?.login ?? 'faizcasm'} · on GitHub since{' '}
              {userData?.created_at
                ? new Date(userData.created_at).getFullYear()
                : '2023'}
            </p>
          </div>
        </div>
        <a
          href={`https://github.com/${userData?.login ?? 'faizcasm'}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open GitHub profile"
          className="rounded-full border border-gray-200 p-2.5 text-gray-500 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:text-blue-400"
        >
          <ExternalLink size={16} />
        </a>
      </div>

      <div className="mb-4">
        <h3 className="mb-1 text-xl font-semibold text-gray-800 dark:text-gray-200">
          Top Languages
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Hover a slice to explore the breakdown
        </p>
        {snapshot && (
          <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            Showing a cached snapshot — GitHub is rate-limiting this network.
          </p>
        )}
      </div>

      <LanguageChart3D data={languages} />

      <div className="mt-6 text-center">
        <a
          href={`https://github.com/${userData?.login ?? 'faizcasm'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          View GitHub Profile
        </a>
      </div>
    </div>
  );
};

export default GitHubStats;
