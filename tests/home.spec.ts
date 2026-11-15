import { expect, test, type Page } from "@playwright/test";

async function gotoHydratedHome(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /^Switch to (dark|light) theme$/ })).toBeVisible();
}

test("selects post rows with j/k and opens the selection with Enter", async ({ page }) => {
  await gotoHydratedHome(page);

  const rows = page.locator("#main-content a[href^='/posts/']:has(h3)");
  await expect(rows.first()).toHaveAttribute("data-selected", "true");

  await page.keyboard.press("j");
  await page.keyboard.press("j");
  await page.keyboard.press("k");
  await expect(rows.nth(1)).toHaveAttribute("data-selected", "true");
  await expect(page.locator("[data-selected]")).toHaveCount(1);

  const href = await rows.nth(1).getAttribute("href");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(`${href}/?$`));
});

test("toggles the theme with t", async ({ page }) => {
  await gotoHydratedHome(page);

  const html = page.locator("html");
  const initialTheme = await html.getAttribute("data-theme");
  await page.keyboard.press("t");
  await expect(html).toHaveAttribute("data-theme", initialTheme === "dark" ? "light" : "dark");
});
