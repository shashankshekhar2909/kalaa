import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

// Storybook's a11y addon runs axe in the same page; wait for it instead of failing with "Axe is already running".
async function scan(page: Page) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await new AxeBuilder({ page }).include("#storybook-root").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    } catch (error) {
      if (attempt >= 10 || !String(error).includes("already running")) throw error;
      await page.waitForTimeout(300);
    }
  }
}

const index = JSON.parse(readFileSync("apps/storybook/storybook-static/index.json", "utf8"));
const stories = Object.values(index.entries as Record<string, { id: string; type: string }>).filter((e) => e.type === "story");

for (const story of stories) {
  for (const theme of ["light", "dark"] as const) {
    test(`${story.id} (${theme})`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme};accent:neel`);
      await page.waitForSelector("#storybook-root > *");
      await page.evaluate(() => document.fonts.ready);
      const axe = await scan(page);
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
      await expect(page.locator("#storybook-root")).toHaveScreenshot(`${story.id}-${theme}.png`);
    });
  }
}
