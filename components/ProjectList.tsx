"use client";

import { useEffect, useState } from "react";
import { fetchProjects, type Project } from "@/lib/github";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectList({ limit }: { limit?: number }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects()
      .then((all) => setProjects(limit ? all.slice(0, limit) : all))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) {
    return (
      <p className="text-app-soft">
        Fetching repos from GitHub
        <span className="cursor" />
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-app-danger">
        Failed to load projects: {error}. You may be hitting the GitHub API rate limit.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <a
        href="https://github.com/fsmiamoto?tab=repositories"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-app-muted hover:text-app-accent"
      >
        View all on GitHub →
      </a>
    </div>
  );
}
