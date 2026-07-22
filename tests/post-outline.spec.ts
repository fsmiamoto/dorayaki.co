import { expect, test } from "@playwright/test";

const structuredPost = "/posts/mcp-considered-harmful/";
const expectedHeadings = [
  "Why MCP is not ideal",
  "What should I use instead?",
  "Composability",
  "So can I just drop MCP completely?",
  "Wrap up",
  "References",
];

test.describe("post outline", () => {
  test("renders linked headings and tracks the active section on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(structuredPost);

    const outline = page.getByRole("navigation", { name: "On this page" });
    const outlineTerminal = page.getByRole("complementary");
    const links = outline.getByRole("link");

    await expect(outline).toBeVisible();
    await expect(outlineTerminal).toContainText("[2]outline");
    await expect(outline).toContainText("$headings post.md");
    await expect(links).toHaveCount(expectedHeadings.length);
    for (const label of expectedHeadings) {
      await expect(outline.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await expect(
      outline.getByText("CLIs over Tools: MCP considered harmful?", { exact: true }),
    ).toHaveCount(0);
    await expect(outline.getByText("Available Actions", { exact: true })).toHaveCount(0);
    await expect(outline).not.toContainText(/section \d|\d+%/i);
    await expect(outline.locator('[aria-current="location"]')).toHaveCount(1);

    const wrapUpLeft = await outline
      .getByRole("link", { name: "Wrap up" })
      .evaluate((link) => link.getBoundingClientRect().left);
    const referencesLeft = await outline
      .getByRole("link", { name: "References" })
      .evaluate((link) => link.getBoundingClientRect().left);
    expect(referencesLeft).toBeGreaterThan(wrapUpLeft);

    const headingIds = await links.evaluateAll((outlineLinks) =>
      outlineLinks.map((link) => link.getAttribute("href")?.slice(1) ?? ""),
    );
    expect(new Set(headingIds).size).toBe(headingIds.length);

    for (const id of headingIds) {
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    }

    const composabilityHeading = page.getByRole("heading", { name: "Composability" });
    const composabilityLink = outline.getByRole("link", { name: "Composability" });
    await composabilityHeading.evaluate((heading) => heading.scrollIntoView());
    await expect(composabilityLink).toHaveAttribute("aria-current", "location");
    await expect(outline.locator('[aria-current="location"]')).toHaveCount(1);
    await expect(outlineTerminal).toBeInViewport();
    await expect
      .poll(() => outlineTerminal.evaluate((terminal) => terminal.getBoundingClientRect().top))
      .toBeLessThanOrEqual(32);

    for (const [label, targetTop] of [
      ["So can I just drop MCP completely?", 200],
      ["Wrap up", 300],
    ] as const) {
      await page.getByRole("heading", { name: label }).evaluate((heading, top) => {
        window.scrollTo(0, window.scrollY + heading.getBoundingClientRect().top - top);
      }, targetTop);
      await expect(outline.getByRole("link", { name: label })).toHaveAttribute(
        "aria-current",
        "location",
      );
      await expect(outline.locator('[aria-current="location"]')).toHaveCount(1);
    }

    const referencesLink = outline.getByRole("link", { name: "References" });
    await referencesLink.click();
    await expect(page).toHaveURL(/#references$/);
    await expect(referencesLink).toHaveAttribute("aria-current", "location");
    await expect(page.getByRole("heading", { name: "References" })).toBeInViewport();

    await page.goto(`${structuredPost}#composability`);
    await expect(page.getByRole("heading", { name: "Composability" })).toBeInViewport();
    await expect(
      page
        .getByRole("navigation", { name: "On this page" })
        .getByRole("link", { name: "Composability" }),
    ).toHaveAttribute("aria-current", "location");
  });

  test("uses an initially collapsed disclosure at a narrow viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(structuredPost);

    const disclosure = page.getByText("On this page", { exact: true });
    const details = page.locator("details").filter({ has: disclosure });

    await expect(disclosure).toBeVisible();
    await expect(details).not.toHaveAttribute("open", "");
    await expect(page.getByRole("complementary")).toBeHidden();

    await disclosure.focus();
    await expect(disclosure).toBeFocused();
    await expect
      .poll(() => disclosure.evaluate((control) => getComputedStyle(control).outlineStyle))
      .not.toBe("none");
    await page.keyboard.press("Enter");

    const outline = page.getByRole("navigation", { name: "On this page" });
    await expect(details).toHaveAttribute("open", "");
    await expect(outline).toBeVisible();
    for (const label of expectedHeadings) {
      await expect(outline.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("does not add an outline to a post with fewer than two headings", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/posts/ralph-wiggum-letting-agents-code-for-hours/");

    await expect(page.getByRole("navigation", { name: "On this page" })).toHaveCount(0);
    await expect(page.getByText("On this page", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("complementary")).toHaveCount(0);
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("keeps the disclosure and fragment links usable", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(structuredPost);

      const disclosure = page.getByText("On this page", { exact: true });
      await disclosure.click();

      const outline = page.getByRole("navigation", { name: "On this page" });
      await expect(outline).toBeVisible();
      await outline.getByRole("link", { name: "Why MCP is not ideal" }).click();
      await expect(page).toHaveURL(/#why-mcp-is-not-ideal$/);
      await expect(page.getByRole("heading", { name: "Why MCP is not ideal" })).toBeInViewport();
      await expect(outline.locator('[aria-current="location"]')).toHaveCount(0);
    });
  });
});
