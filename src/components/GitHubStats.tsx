'use client'

import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import LanguageChart3D, { type LanguageDatum } from './LanguageChart3D';
import type { GithubProfile } from '@/lib/github';

/**
 * GitHub card: profile identity + an interactive 3D breakdown of the
 * languages used across public repositories.
 *
 * Data is fetched and cached on the server (see src/lib/github.ts) and
 * passed in as props — no client-side GitHub calls, so the token stays
 * server-only and the page never races GitHub's rate limit.
 */
interface GitHubStatsProps {
  profile: GithubProfile;
  languages: LanguageDatum[];
  /** false when GitHub was unreachable and the fallback snapshot is shown. */
  live: boolean;
}

const GitHubStats: React.FC<GitHubStatsProps> = ({ profile, languages, live }) => {
  return (
    <div className="flex-grow rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800/90">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={profile.avatar_url}
            alt={`@${profile.login} GitHub avatar`}
            width={48}
            height={48}
            unoptimized
            className="h-12 w-12 rounded-full ring-2 ring-blue-500/60"
          />
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-gray-900 dark:text-white">
              {profile.name || 'Faizan Hameed'}
            </p>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              @{profile.login} · on GitHub since{' '}
              {profile.created_at ? new Date(profile.created_at).getFullYear() : '2023'}
            </p>
          </div>
        </div>
        <a
          href={`https://github.com/${profile.login}`}
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
        {!live && (
          <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            Showing a cached snapshot — GitHub is rate-limiting this network.
          </p>
        )}
      </div>

      <LanguageChart3D data={languages} />

      <div className="mt-6 text-center">
        <a
          href={`https://github.com/${profile.login}`}
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
