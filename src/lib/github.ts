import "server-only";

/**
 * Server-side GitHub access.
 *
 * All GitHub calls happen here, on the server, so the token (GITHUB_SECRET)
 * never reaches the browser — client-side `process.env.GITHUB_SECRET` resolves
 * to `undefined`, which made every request anonymous (60 req/h limit) and was
 * the root cause of the 403s.
 *
 * Every fetch is ISR-cached for an hour, so a page render costs at most a
 * couple of GitHub calls, not dozens. Any failure degrades to a friendly
 * fallback instead of throwing (a failed page build would otherwise take the
 * site down when GitHub rate-limits the deployment network).
 */

const USERNAME = "faizcasm";
const API = "https://api.github.com";

/**
 * Rate-limit resilience:
 *
 * - The token is read from `GITHUB_SECRET` or `GITHUB_TOKEN`, whichever is set.
 *   Without a token every request is anonymous (60 req/h per IP) and the whole
 *   deployment can get 403'd by a single popular page.
 * - Every successful payload is memoised in process memory for `STALE_TTL_MS`.
 *   When GitHub rate-limits or errors we serve that last-good payload instead
 *   of an empty fallback, so cards keep rendering real data across the whole
 *   window until GitHub recovers.
 */
const STALE_TTL_MS = 6 * 60 * 60 * 1000; // keep serving last-good data for 6h
const memory = new Map<string, { value: unknown; at: number }>();

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

async function gh<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "faizcasm-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = githubToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    const reset = res.headers.get("x-ratelimit-reset");
    if (res.status === 403 || res.status === 429) {
      const resetDate = reset ? new Date(Number(reset) * 1000).toISOString() : "unknown";
      console.error(
        `[github] rate-limited on ${path} (status ${res.status}, remaining=${remaining}, reset=${resetDate}, token=${token ? "yes" : "no"})`
      );
    }
    throw new Error(`GitHub ${res.status} for ${path}`);
  }

  return (await res.json()) as T;
}

/**
 * Runs `loader`, memoises the result, and on failure falls back to the
 * last-good value (up to `STALE_TTL_MS` old) before giving up.
 */
async function cached<T>(key: string, loader: () => Promise<T>): Promise<T | null> {
  try {
    const value = await loader();
    memory.set(key, { value, at: Date.now() });
    return value;
  } catch (error) {
    const previous = memory.get(key);
    if (previous && Date.now() - previous.at <= STALE_TTL_MS) {
      console.warn(`[github] serving ${key} from memory after upstream error:`, error);
      return previous.value as T;
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Fallbacks — shown when GitHub is unreachable/rate-limited so no card ever
// renders as an error box.
// ---------------------------------------------------------------------------

export const FALLBACK_PROFILE: GithubProfile = {
  login: USERNAME,
  name: "Faizan Hameed",
  avatar_url: "https://avatars.githubusercontent.com/u/138277686?v=4",
  created_at: "2023-06-01T00:00:00Z",
};

export const FALLBACK_LANGUAGES: LanguageDatum[] = [
  { name: "JavaScript", value: 19 },
  { name: "TypeScript", value: 10 },
  { name: "Python", value: 2 },
  { name: "Java", value: 1 },
  { name: "Shell", value: 1 },
  { name: "HTML", value: 1 },
];

// ---------------------------------------------------------------------------
// Homepage: profile identity + top languages (2 calls, cached)
// ---------------------------------------------------------------------------

export async function getGithubSnapshot(): Promise<{
  profile: GithubProfile;
  languages: LanguageDatum[];
  live: boolean;
}> {
  try {
    const data = await cached("snapshot", () =>
      Promise.all([
        gh<GithubProfile>(`/users/${USERNAME}`),
        gh<GitHubRepo[]>(`/users/${USERNAME}/repos?per_page=100&sort=updated`),
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
      languages: languages.length > 0 ? languages : FALLBACK_LANGUAGES,
      live: true,
    };
  } catch (error) {
    console.error("[github] snapshot failed:", error);
    return { profile: FALLBACK_PROFILE, languages: FALLBACK_LANGUAGES, live: false };
  }
}

// ---------------------------------------------------------------------------
// /projects — ONE call total. The old client code fired listCommits for every
// single repository (40+ requests) just to display a date; `pushed_at` from
// the repo list is equivalent for this purpose.
// ---------------------------------------------------------------------------

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
        repo.pushed_at && !isNaN(Date.parse(repo.pushed_at))
          ? new Date(repo.pushed_at).toISOString()
          : new Date(repo.updated_at).toISOString(),
      isOwn: !repo.fork,
    }));

    projects.sort(
      (a, b) =>
        new Date(b.latestCommitDate).getTime() -
        new Date(a.latestCommitDate).getTime()
    );
    return { projects, live: true };
  } catch (error) {
    console.error("[github] projects snapshot failed:", error);
    return { projects: [], live: false };
  }
}

// ---------------------------------------------------------------------------
// /github-stats: trending search (paginated) + insights.
// Search API limits are stricter (10/min anonymous, 30/min with token), so
// these are cached too and consumed through the internal API route.
// ---------------------------------------------------------------------------

export async function getTrendingSnapshot(page: number): Promise<{
  repos: TrendingRepo[];
  live: boolean;
}> {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
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
    languages: [],
    topRepos: [],
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
          "/search/repositories?q=stars:>50000&sort=stars&order=desc&per_page=10"
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
