export interface Project {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  lastActivity: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(
    "https://api.github.com/users/fsmiamoto/repos?sort=pushed&per_page=100&type=owner",
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const repos: GitHubRepo[] = await res.json();

  return repos
    .filter((repo) => !repo.fork && repo.name !== "fsmiamoto")
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      lastActivity: repo.pushed_at,
    }));
}
