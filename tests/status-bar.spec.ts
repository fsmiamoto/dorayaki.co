import { expect, test } from "@playwright/test";

const post = "/posts/mcp-considered-harmful/";

test("keeps the status bar pinned without covering the end of a post", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(post);

  const bar = page.getByRole("contentinfo");
  await expect(bar).toContainText("NORMAL");
  await expect(bar).toContainText("~/dorayaki.co/posts/mcp-considered-harmful");
  await expect(bar).toContainText("Flavio Miyamoto");
  await expect(bar).toContainText("utf-8");
  await expect(bar.locator("time")).toBeHidden();

  const before = await bar.evaluate((element) => element.getBoundingClientRect());
  expect(before.bottom).toBeCloseTo(800, 0);
  expect(before.top).toBeGreaterThan(760);

  await page.locator("#scroll-root").evaluate((element) => {
    element.scrollTop = 900;
  });

  const midway = await bar.evaluate((element) => element.getBoundingClientRect());
  expect(midway.top).toBeCloseTo(before.top, 0);
  expect(midway.bottom).toBeCloseTo(before.bottom, 0);

  const scrollerBottom = await page
    .locator("#scroll-root")
    .evaluate((element) => element.getBoundingClientRect().bottom);
  const barTopMidway = await bar.evaluate((element) => element.getBoundingClientRect().top);
  expect(scrollerBottom).toBeLessThanOrEqual(barTopMidway + 1);
  expect(barTopMidway).toBeLessThanOrEqual(scrollerBottom + 1);

  await page.locator("#scroll-root").evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });

  const mainBottom = await page
    .locator("#main-content")
    .evaluate((element) => element.getBoundingClientRect().bottom);
  const barTop = await bar.evaluate((element) => element.getBoundingClientRect().top);
  expect(mainBottom).toBeLessThanOrEqual(barTop + 1);
  const allPosts = page.getByRole("link", { name: /All posts/ });
  await expect(allPosts).toBeInViewport();
  expect(
    await allPosts.evaluate((element) => element.getBoundingClientRect().bottom),
  ).toBeLessThanOrEqual(barTop + 1);
});

test("compacts the status bar on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");

  const bar = page.getByRole("contentinfo");
  await expect(bar).toBeInViewport();
  const visibleBar = await bar.evaluate((element) =>
    element instanceof HTMLElement ? element.innerText.replace(/\s+/g, " ").trim() : "",
  );
  expect(visibleBar).toMatch(/© \d{4}/);
  expect(visibleBar).not.toContain("Flavio");
  expect(visibleBar).not.toContain("utf-8");
  expect(visibleBar).toMatch(/\d{2}:\d{2}/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBe(0);

  const barBox = await bar.evaluate((element) => element.getBoundingClientRect());
  expect(barBox.left).toBeGreaterThanOrEqual(0);
  expect(barBox.right).toBeLessThanOrEqual(320);
  expect(barBox.bottom).toBeCloseTo(700, 0);
});
