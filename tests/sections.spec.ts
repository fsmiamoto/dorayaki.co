import { expect, test } from "@playwright/test";
import projects from "../content/projects.json";

test("keeps the home page focused and exposes projects and books on their own pages", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /^Switch to (dark|light) theme$/ })).toBeVisible();

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: "Flavio Miyamoto" })).toBeVisible();
  await expect(main.locator("a[href^='/posts/']:has(h3)")).toHaveCount(5);
  await expect(main.getByRole("heading", { name: "Projects", exact: true })).toHaveCount(0);
  await expect(main.getByRole("heading", { name: "Currently reading" })).toHaveCount(0);
  await expect(main.locator("a[href='/reading/'], a[href='/projects/']")).toHaveCount(0);
  await expect(main.getByRole("img", { name: /^Cover of / })).toHaveCount(0);

  await page.evaluate(() => {
    document.documentElement.dataset.keptAcrossNavigation = "true";
  });

  const navigation = page.getByRole("navigation", { name: "Main" });
  const projectsLink = navigation.getByRole("link", { name: /projects/ });
  await projectsLink.click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(projectsLink).toHaveAttribute("aria-current", "page");
  await expect(main.getByRole("heading", { level: 1, name: "Projects" })).toBeVisible();
  await expect(main.getByRole("link")).toHaveCount(projects.length);
  for (const project of projects) {
    const link = main.getByRole("link").filter({ hasText: `${project.name}/` });
    await expect(link).toHaveAttribute("href", project.url);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toContainText(project.description);
  }
  await expect(page.locator("html")).toHaveAttribute("data-kept-across-navigation", "true");

  const readingLink = navigation.getByRole("link", { name: /reading/ });
  await readingLink.click();
  await expect(page).toHaveURL(/\/reading\/$/);
  await expect(readingLink).toHaveAttribute("aria-current", "page");
  await expect(main.getByRole("heading", { name: "Reading List" })).toBeVisible();
  await expect(main.getByRole("tab", { name: /^reading:/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await main.getByRole("tab", { name: /^queue:/ }).click();
  await expect(main.getByRole("tab", { name: /^queue:/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("html")).toHaveAttribute("data-kept-across-navigation", "true");

  await navigation.getByRole("link", { name: /home/ }).click();
  await expect(main.getByRole("heading", { name: "Flavio Miyamoto" })).toBeVisible();
});

test("exports the projects route with canonical metadata and a sitemap entry", async ({
  page,
  request,
}) => {
  const response = await page.goto("/projects/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Projects - dorayaki");
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute(
    "href",
    "https://dorayaki.co/projects/",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("<loc>https://dorayaki.co/projects/</loc>");
});

for (const width of [320, 390]) {
  test(`keeps navigation accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const navigation = page.getByRole("navigation", { name: "Main" });
    const toggle = navigation.getByRole("button", { name: /^Switch to (dark|light) theme$/ });
    await expect(toggle).toBeInViewport();
    const projectsLink = navigation.getByRole("link", { name: /projects/ });
    await projectsLink.focus();
    await expect(projectsLink).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Projects", level: 1 })).toBeVisible();
    await expect(toggle).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    ).toBe(0);
    await navigation.getByRole("link", { name: /reading/ }).click();
    await expect(page.getByRole("heading", { name: "Reading List" })).toBeVisible();
  });
}
