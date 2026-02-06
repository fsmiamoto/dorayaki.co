import type { Project } from "@/lib/github";

export default function ProjectCard({ project }: { project: Project }) {
  const date = new Date(project.lastActivity).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="-m-2 block rounded-md p-2 hover:bg-app-surface-muted"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-app-foreground hover:text-app-accent">
            {project.name}
          </span>
          {project.stars > 0 && (
            <span className="text-xs text-app-amber">&#9733; {project.stars}</span>
          )}
        </div>
        {project.description && <p className="text-app-soft">{project.description}</p>}
        <div className="flex items-center gap-2 text-app-muted">
          {project.language && <span>{project.language}</span>}
          {project.language && <span>&middot;</span>}
          <span>{date}</span>
        </div>
      </div>
    </a>
  );
}
