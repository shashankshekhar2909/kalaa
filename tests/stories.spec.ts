import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { readFileSync } from "node:fs";

// Storybook's a11y addon runs axe in the same page; wait for it instead of failing with "Axe is already running".
async function scan(page: Page) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await new AxeBuilder({ page })
        .include("#storybook-root")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
    } catch (error) {
      if (attempt >= 10 || !String(error).includes("already running")) throw error;
      await page.waitForTimeout(300);
    }
  }
}

const index = JSON.parse(readFileSync("apps/storybook/storybook-static/index.json", "utf8"));
const stories = Object.values(index.entries as Record<string, { id: string; type: string }>).filter(
  (e) => e.type === "story",
);

async function check(page: Page, id: string, globals: string, name: string) {
  test.info().annotations.push({ type: "scan" });
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=${globals}`);
  await page.waitForSelector("#storybook-root > *");
  await page.evaluate(() => document.fonts.ready);
  const axe = await scan(page);
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
  await expect(page.locator("#storybook-root")).toHaveScreenshot(name);
}

// Full matrix: every story, square shape, Neel, light and dark.
for (const story of stories) {
  for (const theme of ["light", "dark"] as const) {
    test(`${story.id} (${theme})`, async ({ page }) => {
      await check(page, story.id, `theme:${theme};accent:neel`, `${story.id}-${theme}.png`);
    });
  }
}

// Smoke subset: the soft shape and the other two accents, light and dark.
const smoke = [
  "components-button--primary",
  "components-card--default",
  "components-field--with-hint",
  "components-dialog--default",
  "examples-product-editor--default",
];
const variants = [
  { name: "soft-neel", globals: "accent:neel;shape:soft" },
  { name: "square-geru", globals: "accent:geru" },
  { name: "square-mayur", globals: "accent:mayur" },
];
for (const id of smoke) {
  test(`smoke story exists: ${id}`, () => {
    expect(stories.map((s) => s.id)).toContain(id);
  });
  for (const variant of variants)
    for (const theme of ["light", "dark"] as const)
      test(`${id} (${variant.name}, ${theme})`, async ({ page }) => {
        await check(page, id, `theme:${theme};${variant.globals}`, `${id}-${variant.name}-${theme}.png`);
      });
}
