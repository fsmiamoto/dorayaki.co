# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production (static export to out/)
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run format:check # Check formatting
```

## Architecture

This is a statically-generated Next.js 15 blog with a terminal/CLI aesthetic, deployed to GitHub Pages.

### Content System

Blog posts are Markdown files in `/content/posts/` with YAML front matter:

```markdown
---
title: "Post Title"
date: "2024-01-15"
tags: [tag1, tag2]
excerpt: "Optional excerpt"
---
```

- `lib/posts.ts` - Post loading utilities (getAllPosts, getPostBySlug, getPostsByTag)
- `lib/mdx.tsx` - MDX rendering with custom component overrides and syntax highlighting (sugar-high)
- `content/books.json` - Book data for /reading page

### Routing (App Router)

- `/` - Home page
- `/posts` - Posts listing
- `/posts/[slug]` - Individual post (statically generated via generateStaticParams)
- `/about` - About page
- `/reading` - Book reading list

### Theming

CSS variables define the color system (see `tailwind.config.js` for `app.*` and `terminal.*` colors). Theme toggle uses React Context with localStorage persistence. The `data-theme` attribute on `<html>` switches between dark/light.

### Key Components

- `TerminalWindow` - macOS terminal-style container
- `CommandPrompt` - Terminal command display (e.g., `cat posts/[slug].md`)
- `ThemeProvider` - Context-based dark/light mode

### Static Export

The site uses `output: "export"` in next.config.js. All pages are pre-rendered at build time with no runtime server.
