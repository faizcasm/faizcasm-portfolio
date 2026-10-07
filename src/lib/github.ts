import "server-only";
import { resumeData } from "@/data/resumeData";

const USERNAME = "faizcasm";
const API = "https://api.github.com";
const FETCH_REVALIDATE_SECONDS = 3600;
const STALE_TTL_MS = 6 * 60 * 60 * 1000;

const memory = new Map<string, { value: unknown; at: number }>();
const inFlight = new Map<string, Promise<unknown>>();
const blockedUntil = new Map<string, number>();

function githubToken(): string | undefined {
  return process.env.GITHUB_SECRET || process.env.GITHUB_TOKEN || undefined;
}

export interface GithubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  created_at: string;
}

export interface LanguageDatum {
  name: string;
  value: number;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink?: string;
  latestCommitDate: string;
  isOwn: boolean;
}

export interface TrendingRepo {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
}

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  fork: boolean;
  topics?: string[];
  language: string | null;
  updated_at: string;
  pushed_at: string | null;
}

class GitHubHttpError extends Error {
  status: number;
  resetAt?: number;

  constructor(status: number, message: string, resetAt?: number) {
    super(message);
    this.status = status;
    this.resetAt = resetAt;
  }
}

function parseResetAt(response: Response): number | undefined {
  const retryAfter = response.headers.get("retry-after");
  if (retryAfter) {
    const numeric = Number(retryAfter);
    if (Number.isFinite(numeric)) return Date.now() + numeric * 1000;
    const parsedDate = Date.parse(retryAfter);
    if (!Number.isNaN(parsedDate)) return parsedDate;
  }

  const reset = Number(response.headers.get("x-ratelimit-reset"));
  if (Number.isFinite(reset) && reset > 0) return reset * 1000;
  return undefined;
}

async function gh<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "faizcasm-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const token = githubToken();
  if (token) headers.Authorization = "Bearer " + token;

  const response = await fetch(`${API}${path}`, {
    headers,
    cache: "force-cache",
    next: { revalidate: FETCH_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    const resetAt = parseResetAt(response);
    throw new GitHubHttpError(response.status, `GitHub ${response.status} for ${path}`, resetAt);
  }

  return (await response.json()) as T;
}

async function cached<T>(key: string, loader: () => Promise<T>): Promise<T | null> {
  const now = Date.now();
  const previous = memory.get(key);
  const blocked = blockedUntil.get(key);

  if (blocked && blocked > now && previous && now - previous.at <= STALE_TTL_MS) {
    return previous.value as T;
  }

  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;

  const work = (async () => {
    try {
      const value = await loader();
      memory.set(key, { value, at: Date.now() });
      blockedUntil.delete(key);
      return value;
    } catch (error) {
      if (error instanceof GitHubHttpError && (error.status === 403 || error.status === 429) && error.resetAt) {
        blockedUntil.set(key, error.resetAt);
      }
      const cachedValue = memory.get(key);
      if (cachedValue && Date.now() - cachedValue.at <= STALE_TTL_MS) {
        return cachedValue.value as T;
      }
      throw error;
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, work as Promise<unknown>);
  return work;
}

export const FALLBACK_PROFILE: GithubProfile = {
  login: USERNAME,
  name: "Faizan Hameed",
  avatar_url: "https://avatars.githubusercontent.com/u/138277686?v=4",
  created_at: "2023-06-01T00:00:00Z",
};

export const FALLBACK_LANGUAGES: LanguageDatum[] = [
  { name: "TypeScript", value: 12 },
  { name: "JavaScript", value: 10 },
  { name: "Python", value: 3 },
  { name: "SQL", value: 2 },
];

const FALLBACK_PROJECTS: Project[] = resumeData.projects.map((project) => ({
  title: project.name,
  description: project.bullets.join(" "),
  technologies: [...project.technologies],
  githubLink: project.repo,
  liveLink: project.link,
  latestCommitDate: "2026-01-01T00:00:00.000Z",
  isOwn: true,
}));

export async function getGithubSnapshot(): Promise<{
  profile: GithubProfile;
  languages: LanguageDatum[];
  live: boolean;
}> {
  try {
    const data = await cached("snapshot", () =>
      Promise.all([
        gh<GithubProfile>(`/users/${USERNAME}`),
        gh<GitHubRepo[]>(`/users/${USERNAME}/repos?per_page=100&sort=updated&type=owner`),
      ])
    );
    if (!data) throw new Error("empty snapshot");
    const [profile, repos] = data;

    const counts: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) counts[repo.language] = (counts[repo.language] ?? 0) + 1;
    }

    const languages = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return {
      profile,
      languages: languages.length ? languages : FALLBACK_LANGUAGES,
      live: true,
    };
  } catch (error) {
    console.error("[github] snapshot failed:", error);
    return { profile: FALLBACK_PROFILE, languages: FALLBACK_LANGUAGES, live: false };
  }
}

export async function getProjectsSnapshot(): Promise<{
  projects: Project[];
  live: boolean;
}> {
  try {
    const repos = await cached("projects", () =>
      gh<GitHubRepo[]>(`/users/${USERNAME}/repos?per_page=100&sort=updated&type=all`)
    );
    if (!repos || repos.length === 0) throw new Error("no repositories");

    const projects: Project[] = repos.map((repo) => ({
      title: repo.name,
      description: repo.description || "No description available",
      technologies: repo.topics ?? [],
      githubLink: repo.html_url,
      liveLink: repo.homepage || undefined,
      latestCommitDate:
        repo.pushed_at && !Number.isNaN(Date.parse(repo.pushed_at))
          ? new Date(repo.pushed_at).toISOString()
          : new Date(repo.updated_at).toISOString(),
      isOwn: !repo.fork,
    }));

    projects.sort(
      (a, b) => new Date(b.latestCommitDate).getTime() - new Date(a.latestCommitDate).getTime()
    );

    return { projects, live: true };
  } catch (error) {
    console.error("[github] projects snapshot failed:", error);
    return { projects: FALLBACK_PROJECTS, live: false };
  }
}

export async function getTrendingSnapshot(page: number): Promise<{
  repos: TrendingRepo[];
  live: boolean;
}> {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const data = await cached(`trending:${page}`, () =>
      gh<{ items: TrendingRepo[] }>(
        `/search/repositories?q=created:>${since}&sort=stars&order=desc&per_page=6&page=${page}`
      )
    );
    return { repos: data?.items ?? [], live: true };
  } catch (error) {
    console.error("[github] trending snapshot failed:", error);
    return { repos: [], live: false };
  }
}

export interface InsightsSnapshot {
  languages: LanguageDatum[];
  topRepos: { name: string; stars: number }[];
  live: boolean;
}

export async function getInsightsSnapshot(): Promise<InsightsSnapshot> {
  const fallback: InsightsSnapshot = {
    languages: FALLBACK_LANGUAGES,
    topRepos: FALLBACK_PROJECTS.map((project) => ({ name: project.title, stars: 0 })),
    live: false,
  };

  try {
    type InsightsPayload = [
      { items: { language: string | null }[] },
      { items: { name: string; stargazers_count: number }[] },
    ];

    const data = await cached<InsightsPayload>("insights", () =>
      Promise.all([
        gh<{ items: { language: string | null }[] }>(
          "/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=100"
        ),
        gh<{ items: { name: string; stargazers_count: number }[] }>(
          "/search/repositories?q=user:faizcasm&sort=stars&order=desc&per_page=10"
        ),
      ])
    );
    if (!data) throw new Error("empty insights");
    const [langRes, repoRes] = data;

    const counts: Record<string, number> = {};
    for (const repo of langRes.items ?? []) {
      if (repo.language) counts[repo.language] = (counts[repo.language] ?? 0) + 1;
    }

    return {
      languages: Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 7),
      topRepos: (repoRes.items ?? []).map((repo) => ({
        name: repo.name,
        stars: repo.stargazers_count,
      })),
      live: true,
    };
  } catch (error) {
    console.error("[github] insights snapshot failed:", error);
    return fallback;
  }
}
