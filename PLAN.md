# UX/UI Polish Plan for dorayaki.co

All changes must preserve the existing terminal aesthetic. Run `npm run build` after each task to verify the static export still works. Do NOT install new dependencies unless absolutely necessary.

## Task 1: Fix OG Meta Description & Self-Deprecating Copy
**Files:** `app/layout.tsx`, `app/posts/page.tsx`

- [ ] In `app/layout.tsx`, change `description: "personal blog of a terrible engineer"` to `description: "Software engineer writing about systems, AI agents, and engineering culture"` in ALL three places (metadata.description, openGraph.description, twitter.description)
- [ ] In `app/posts/page.tsx`, change `description: "My (not so great) writing"` to `description: "Posts on software engineering, AI, and more"` in ALL three places (metadata.description, openGraph.description, twitter.description). Keep the self-deprecating text ONLY in the visible `help` command on the home page (`app/page.tsx`) — that one is charming in context
- [ ] Run `npm run build` to verify

## Task 2: Show 3 Recent Posts on Home Page
**Files:** `app/page.tsx`

- [ ] Change `getAllPosts().slice(0, 1)` to `getAllPosts().slice(0, 3)` in `app/page.tsx`
- [ ] Change the command from `ls -lt posts/ | head -1` to `ls -lt posts/ | head -3`
- [ ] Run `npm run build` to verify

## Task 3: Add Persistent Global Navigation
**Files:** `app/layout.tsx` (or a new component `components/TerminalNav.tsx`)

Create a minimal terminal-themed footer navigation bar that appears on ALL pages. It should:

- [ ] Create `components/TerminalNav.tsx` as a simple server component (no "use client"). It renders a `<nav>` with terminal-style links. Use the existing link classes.
- [ ] The nav should look like a terminal PATH display: links in a horizontal row with monospace font. Example structure:
```tsx
<nav className="mt-6 border-t border-app-border-subtle pt-4">
  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-app-muted sm:text-sm">
    <span className="text-app-faint">~/</span>
    <Link href="/" className="link-nav">home</Link>
    <Link href="/posts" className="link-nav text-app-purple">posts/</Link>
    <Link href="/about" className="link-nav">about.md</Link>
    <Link href="/reading" className="link-nav text-app-info">reading.md</Link>
    <Link href="/cv.pdf" className="link-nav text-app-amber" target="_blank" rel="noopener noreferrer">resume.pdf</Link>
  </div>
</nav>
```
- [ ] Add `<TerminalNav />` in `app/layout.tsx` AFTER the `<main>` element but still inside the ThemeProvider, wrapped in a container matching main's max-width: `<div className="container mx-auto max-w-full px-2 pb-8 sm:max-w-4xl sm:px-4"><TerminalNav /></div>`
- [ ] Run `npm run build` to verify

## Task 4: Group Posts by Year on Posts Listing
**Files:** `components/PostList.tsx` or `components/PostsResults.tsx`

- [ ] Modify `PostsResults.tsx` (or `PostList.tsx` — whichever is simpler) to group posts by year. Extract the year from each post's `formattedDate` or `frontMatter.date`. 
- [ ] Render a year divider before each group. Style it as a terminal-style separator:
```tsx
<div className="flex items-center gap-3 text-xs text-app-faint">
  <span className="font-semibold tracking-[0.3em]">{year}</span>
  <span className="flex-1 border-t border-app-border-subtle" />
</div>
```
- [ ] The year dividers should use `text-app-faint` color. Posts under each year group continue using the existing PostList item styling.
- [ ] Run `npm run build` to verify

## Task 5: Collapse Finished Books Section on Reading Page
**Files:** `components/BookSection.tsx` (needs client interactivity for collapse)

- [ ] Add an optional `collapsible` prop and `defaultCollapsed` prop to `BookSection`
- [ ] When `collapsible` is true, make the component a client component (or extract an inner client wrapper). Show a toggle button next to the section title that shows/hides the book list. The button should show the count: e.g., "▸ Finished (42)" when collapsed, "▾ Finished (42)" when expanded.
- [ ] In `app/reading/page.tsx`, pass `collapsible={true} defaultCollapsed={true}` ONLY to the "Finished" BookSection (not "Currently Reading" or "Reading Queue")
- [ ] Run `npm run build` to verify
