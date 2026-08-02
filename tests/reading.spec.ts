import { expect, test } from "@playwright/test";

const covers = [
  {
    title: "Hands-On LLM Serving and Optimization",
    url: "https://covers.oreillystatic.com/images/9798341621480/lrg.jpg",
  },
  {
    title: "Learning Systems Thinking",
    url: "https://covers.oreillystatic.com/images/9781098151324/lrg.jpg",
  },
];

test("uses configured cover images before ISBN fallbacks", async ({ page }) => {
  await page.goto("/reading/");

  for (const cover of covers) {
    await expect(page.getByRole("img", { name: `Cover of ${cover.title}` })).toHaveAttribute(
      "src",
      cover.url,
    );
  }
});
