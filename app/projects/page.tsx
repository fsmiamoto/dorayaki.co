import type { Metadata } from "next";
import CommandPrompt from "@/components/CommandPrompt";
import projects from "@/content/projects.json";
import { absoluteUrl, withTrailingSlash } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projects - dorayaki",
  description: "Projects by Flavio Miyamoto",
  alternates: {
    canonical: withTrailingSlash("/projects"),
  },
  openGraph: {
    title: "Projects - dorayaki",
    description: "Projects by Flavio Miyamoto",
    url: absoluteUrl(withTrailingSlash("/projects")),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects - dorayaki",
    description: "Projects by Flavio Miyamoto",
  },
};

const languageColors: Record<string, string> = {
  Rust: "#dea584",
  TypeScript: "#3178c6",
  Go: "#00add8",
};

export default function ProjectsPage() {
  return (
    <CommandPrompt command="ls projects/" showCursor={false}>
      <header className="mb-7 space-y-2">
        <h1 className="text-[22px] font-bold leading-tight tracking-tight sm:text-[28px]">
          Projects
        </h1>
        <p className="text-app-muted">A few things I&apos;ve been building.</p>
      </header>
      <div className="grid gap-x-7 border-t border-app-border-subtle sm:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block border-b border-app-border-subtle py-[13px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-bold text-app-info group-hover:underline">{project.name}/</h2>
              <span className="flex items-center gap-1.5 text-xs text-app-muted">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: languageColors[project.language] }}
                />
                {project.language}
              </span>
            </div>
            <p className="mt-0.5 text-[13px] text-app-muted">{project.description}</p>
          </a>
        ))}
      </div>
    </CommandPrompt>
  );
}
