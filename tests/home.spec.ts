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

test("uses accessible sun/moon icons and preserves the theme choice", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await gotoHydratedHome(page);

  const navigation = page.getByRole("navigation", { name: "Main" });
  const toggle = navigation.getByRole("button");
  const html = page.locator("html");

  await expect(toggle).toHaveAccessibleName("Switch to light theme");
  await expect(toggle).toHaveAttribute("title", "Switch to light theme (t)");
  await expect(toggle).toHaveText("");
  await expect(toggle.locator(".theme-icon-sun")).toBeVisible();
  await expect(toggle.locator(".theme-icon-moon")).toBeHidden();
  expect(await navigation.evaluate((nav) => nav.getBoundingClientRect().height)).toBe(48);
  const buttonSize = await toggle.boundingBox();
  expect(buttonSize?.width).toBe(44);
  expect(buttonSize?.height).toBe(44);

  await toggle.click();
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(toggle).toHaveAccessibleName("Switch to dark theme");
  await expect(toggle.locator(".theme-icon-moon")).toBeVisible();
  await expect(toggle.locator(".theme-icon-sun")).toBeHidden();
  await page.reload();
  await expect(toggle).toHaveAccessibleName("Switch to dark theme");
  await expect(html).toHaveAttribute("data-theme", "light");

  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(toggle.locator(".theme-icon-sun")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(html).toHaveAttribute("data-theme", "light");
});

test("switches pages without a full reload", async ({ page }) => {
  await gotoHydratedHome(page);
  await page.evaluate(() => {
    document.documentElement.dataset.keptAcrossNavigation = "true";
  });

  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "about" }).click();

  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole("heading", { name: "About me" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-kept-across-navigation", "true");
});
