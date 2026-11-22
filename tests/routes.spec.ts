import { readdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

function trackPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  return errors;
}

const pages = [
  {
    path: "/",
    heading: "Flavio Miyamoto",
    text: "posts/",
  },
  {
    path: "/posts/",
    heading: "Posts",
    text: "CLIs over Tools: MCP considered harmful?",
  },
  {
    path: "/posts/mcp-considered-harmful/",
    heading: "CLIs over Tools: MCP considered harmful?",
    text: "This post aims to discourage that.",
  },
  {
    path: "/about/",
    heading: "About me",
    text: "Sakana AI",
  },
  {
    path: "/reading/",
    heading: "Reading List",
    text: "Last update",
  },
  {
    path: "/projects/",
    heading: "Projects",
    text: "mansk",
  },
] as const;

for (const route of pages) {
  test(`${route.path} renders key content with no console errors`, async ({ page }) => {
    const errors = trackPageErrors(page);
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: route.heading, exact: true }),
    ).toBeVisible();
    const content =
      route.path === "/posts/mcp-considered-harmful/"
        ? page.locator("article")
        : page.getByRole("main");
    await expect(content).toContainText(route.text);
    expect(errors).toEqual([]);
  });
}

test("/feed.xml renders the RSS feed with no console errors", async ({ page }) => {
  const errors = trackPageErrors(page);
  const response = await page.goto("/feed.xml");
  expect(response?.status()).toBe(200);

  const xml = await response?.text();
  const postCount = readdirSync("content/posts").filter(
    (name) => name.endsWith(".md") || name.endsWith(".mdx"),
  ).length;

  expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
  expect(xml).toContain("<title>dorayaki</title>");
  expect(xml).toContain("<link>https://dorayaki.co/</link>");
  expect(xml).toContain("https://dorayaki.co/posts/mcp-considered-harmful/");
  expect(xml?.match(/<item>/g)).toHaveLength(postCount);
  expect(errors).toEqual([]);
});
