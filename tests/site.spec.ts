import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const site = "http://127.0.0.1:6210";
const pages = ["/", "/getting-started.html", "/brand.html", "/404.html"];
const themes = ["light", "dark"] as const;
const accents = ["neel", "geru", "mayur"] as const;
const shapes = ["square", "soft"] as const;

// Axe (WCAG 2.0/2.1/2.2 AA) on every page in light/dark x 3 accents x square/soft. Preferences are set through
// localStorage, which also exercises the head script that applies them before paint.
for (const path of pages)
  for (const theme of themes)
    for (const accent of accents)
      for (const shape of shapes)
        test(`axe ${path} (${theme}, ${accent}, ${shape})`, async ({ page }) => {
          test.info().annotations.push({ type: "scan" });
          await page.addInitScript(
            ([t, a, s]) => {
              localStorage.setItem("kalaa-site-theme", t);
              localStorage.setItem("kalaa-site-accent", a);
              localStorage.setItem("kalaa-site-shape", s);
            },
            [theme, accent, shape],
          );
          await page.goto(site + path);
          await page.evaluate(() => document.fonts.ready);
          const root = page.locator("html");
          await expect(root).toHaveAttribute("data-theme", theme);
          if (accent !== "neel") await expect(root).toHaveAttribute("data-accent", accent);
          const axe = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze();
          expect(
            axe.violations.map((v) => `${v.id}: ${v.nodes.length} node(s) ${v.nodes[0]?.target}`),
          ).toEqual([]);
        });

test.describe("interactions", () => {
  test("accent switch applies, persists across reload and ignores invalid stored values", async ({
    page,
  }) => {
    await page.goto(site + "/");
    await page.getByRole("combobox", { name: "Accent" }).click();
    await page.getByRole("option", { name: "Geru" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-accent", "geru");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-accent", "geru");
    await page.evaluate(() => localStorage.setItem("kalaa-site-accent", "<script>"));
    await page.reload();
    await expect(page.locator("html")).not.toHaveAttribute("data-accent", /.+/);
  });

  test("shape switch toggles soft", async ({ page }) => {
    await page.goto(site + "/");
    await page.getByRole("combobox", { name: "Shape" }).click();
    await page.getByRole("option", { name: "Soft" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-shape", "soft");
  });

  test("reads without JavaScript: content, links and no broken switches", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(site + "/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Square, calm, and built for work." }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Brand" }),
    ).toBeVisible();
    await expect(page.getByRole("group", { name: "Display settings" })).toBeHidden();
    await expect(page.locator(".site-noscript")).toBeVisible();
    await context.close();
  });

  test("mobile menu is a disclosure", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto(site + "/");
    const menu = page.getByRole("button", { name: "Menu" });
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(
      page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Brand" }),
    ).toBeHidden();
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Brand" }),
    ).toBeVisible();
  });

  test("copy button reports success and a clipboard failure", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(site + "/getting-started.html");
    await page.getByRole("button", { name: "Copy install command" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Copied" })).toBeVisible();
    await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { value: undefined }));
    await page.getByRole("button", { name: "Copy install command" }).click();
    await expect(page.getByText("Select the text and copy it")).toBeVisible();
  });

  test("unknown paths get the 404 page", async ({ page }) => {
    await page.goto(site + "/404.html");
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  });

  test("storybook link base is configurable and defaults to /storybook/", async ({ page }) => {
    await page.goto(site + "/");
    await expect(page.getByRole("link", { name: "Open Storybook" })).toHaveAttribute(
      "href",
      /^\/storybook\/\?path=/,
    );
  });
});
