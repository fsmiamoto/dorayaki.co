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
    await page.setViewportSize({ width: 1536, height: 900 });
    await page.goto(structuredPost);

    const outline = page.getByRole("navigation", { name: "On this page" });
    const outlineAside = page.getByRole("complementary");
    const links = outline.getByRole("link");

    await expect(outline).toBeVisible();
    await expect(outlineAside).toContainText("# on this page");
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

    const wrapUpIndent = await outline
      .getByRole("link", { name: "Wrap up" })
      .evaluate((link) => parseFloat(getComputedStyle(link).paddingLeft));
    const referencesIndent = await outline
      .getByRole("link", { name: "References" })
      .evaluate((link) => parseFloat(getComputedStyle(link).paddingLeft));
    expect(referencesIndent).toBeGreaterThan(wrapUpIndent);

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
    await expect(outlineAside).toBeInViewport();
    await expect
      .poll(() => outlineAside.evaluate((aside) => aside.getBoundingClientRect().top))
      .toBeLessThanOrEqual(64);

    for (const [label, targetTop] of [
      ["So can I just drop MCP completely?", 200],
      ["Wrap up", 300],
    ] as const) {
      await page.getByRole("heading", { name: label }).evaluate((heading, top) => {
        const scroller = document.getElementById("scroll-root");
        if (!scroller) return;
        scroller.scrollTop += heading.getBoundingClientRect().top - top;
      }, targetTop);
      await expect(outline.getByRole("link", { name: label })).toHaveAttribute(
        "aria-current",
        "location",
      );
      await expect(outline.locator('[aria-current="location"]')).toHaveCount(1);
    }

    const wrapUpLink = outline.getByRole("link", { name: "Wrap up" });
    await wrapUpLink.click();
    await expect(page).toHaveURL(/#wrap-up$/);
    await expect(wrapUpLink).toHaveAttribute("aria-current", "location");
    await expect(outline.locator('[aria-current="location"]')).toHaveCount(1);

    const referencesLink = outline.getByRole("link", { name: "References" });
    await referencesLink.click();
    await expect(page).toHaveURL(/#references$/);
    await expect(referencesLink).toHaveAttribute("aria-current", "location");
    await expect(page.getByRole("heading", { name: "References" })).toBeInViewport();

    await page.goto(`${structuredPost}#composability`);
    await expect(page.getByRole("heading", { name: "Composability" })).toBeInViewport();
    const navBottom = await page
      .getByRole("navigation", { name: "Main" })
      .evaluate((nav) => nav.getBoundingClientRect().bottom);
    await expect
      .poll(() =>
        page
          .getByRole("heading", { name: "Composability" })
          .evaluate((heading) => heading.getBoundingClientRect().top),
      )
      .toBeGreaterThanOrEqual(navBottom);
    await expect(
      page
        .getByRole("navigation", { name: "On this page" })
        .getByRole("link", { name: "Composability" }),
    ).toHaveAttribute("aria-current", "location");
  });

  test("keeps the site shell stable and embeds the outline until its column fits", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 900 });
    await page.goto("/");

    const homeContentLeft = await page
      .locator("#main-content")
      .evaluate((content) => content.getBoundingClientRect().left);
    const homeNavigationLeft = await page
      .getByRole("link", { name: "dorayaki" })
      .evaluate((link) => link.closest("nav")?.getBoundingClientRect().left ?? -1);

    await page.goto(structuredPost);

    const postContentLeft = await page
      .locator("#main-content")
      .evaluate((content) => content.getBoundingClientRect().left);
    const postNavigationLeft = await page
      .getByRole("link", { name: "dorayaki" })
      .evaluate((link) => link.closest("nav")?.getBoundingClientRect().left ?? -1);

    expect(postContentLeft).toBeCloseTo(homeContentLeft, 0);
    expect(postNavigationLeft).toBeCloseTo(homeNavigationLeft, 0);
    await expect(page.getByRole("complementary")).toBeVisible();

    await page.setViewportSize({ width: 900, height: 900 });

    await expect(page.getByRole("complementary")).toBeHidden();
    await expect(page.getByText("On this page", { exact: true })).toBeVisible();
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
