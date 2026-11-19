// Build-time facts shown on the site. Everything is computed here, nothing is typed by hand:
// component count from the source folders, contrast checks from the token pair list, axe results from the last
// Playwright run (apps/site/quality.json, written by tests/quality-reporter.ts), version from @kalaa/react.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const read = (file) => JSON.parse(readFileSync(root + file, "utf8"));
const tokens = await import(root + "packages/tokens/dist/index.js");
const components = readdirSync(root + "packages/react/src/components", { withFileTypes: true }).filter((d) =>
  d.isDirectory(),
).length;
const version =
  /KALAA_VERSION = "([^"]+)"/.exec(readFileSync(root + "packages/react/src/util.ts", "utf8"))?.[1] ?? "0.0.0";
const qualityFile = root + "apps/site/quality.json";
const quality = existsSync(qualityFile) ? read("apps/site/quality.json").stories : null;
const built = process.env.SOURCE_DATE_EPOCH
  ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString().slice(0, 10)
  : new Date().toISOString().slice(0, 10);
export const storybook = process.env.SITE_STORYBOOK_URL ?? "/storybook/";
export const facts = {
  version,
  built,
  components,
  accents: tokens.accents.length,
  modes: tokens.modes.length,
  contrastChecks: tokens.contrastPairs.length * tokens.accents.length * tokens.modes.length,
  quality: quality ? { scans: quality.scans, failed: quality.failed, at: quality.at } : null,
};
