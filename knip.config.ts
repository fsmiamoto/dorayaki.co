import type { KnipConfig } from "knip";

// Pull import statements out of Markdown the same way Knip's MDX compiler does,
// so posts rendered through next-mdx-remote stay in the module graph.
const markdownImport = /^import[^'"]+['"][^'"]+['"]/gm;

function markdownImports(text: string): string {
  if (!text.includes("import") && !text.includes("export")) {
    return "";
  }

  const source = text.replace(/^---\r?\n[\s\S]*?\r?\n---/, "").replace(/```[\s\S]*?```/g, "");
  return source.match(markdownImport)?.join("\n") ?? "";
}

const config: KnipConfig = {
  // Next, Playwright, Tailwind, PostCSS, Prettier, TypeScript, and GitHub
  // Actions plugins add their own entries. Overrides replace those defaults,
  // so this list only adds files the plugins do not already cover.
  // Next reads pageExtensions from next.config.js, including md and mdx.
  // Playwright reads testDir from playwright.config.ts.
  entry: ["content/**/*.{md,mdx}", "*.md"],
  compilers: {
    mdx: true,
    md: markdownImports,
  },
  ignoreDependencies: [
    // ESLint 9 with eslint-config-next disables Knip's ESLint config resolver.
    // Both packages are used by `next lint` through .eslintrc.json.
    "eslint",
    "eslint-config-next",
  ],
};

export default config;
