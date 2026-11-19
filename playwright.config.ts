import { defineConfig } from "@playwright/test";

// Storybook suite (tests/stories.spec.ts) runs against the built Storybook (pnpm build-storybook first);
// site suite (tests/site.spec.ts) runs against the built site (pnpm build:site first).
export default defineConfig({
  testDir: "tests",
  snapshotPathTemplate: "tests/__screenshots__/{arg}{ext}",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled" } },
  reporter: [["list"], ["./tests/quality-reporter.ts"]],
  use: { baseURL: "http://127.0.0.1:6200", viewport: { width: 1000, height: 720 } },
  webServer: [
    {
      command: "node scripts/serve-static.mjs apps/storybook/storybook-static 6200",
      url: "http://127.0.0.1:6200/index.json",
      reuseExistingServer: true,
    },
    {
      command: "node scripts/serve-static.mjs apps/site/dist 6210",
      url: "http://127.0.0.1:6210/index.html",
      reuseExistingServer: true,
    },
  ],
});
