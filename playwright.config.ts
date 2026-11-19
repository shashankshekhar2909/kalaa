import { defineConfig } from "@playwright/test";

// Runs against the built Storybook (pnpm build-storybook first). Every story: axe scan + screenshot, light and dark.
export default defineConfig({
  testDir: "tests",
  snapshotPathTemplate: "tests/__screenshots__/{arg}{ext}",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled" } },
  use: { baseURL: "http://127.0.0.1:6200", viewport: { width: 1000, height: 720 } },
  webServer: {
    command: "node scripts/serve-static.mjs apps/storybook/storybook-static 6200",
    url: "http://127.0.0.1:6200/index.json",
    reuseExistingServer: true,
  },
});
