// Builds the static site into apps/site/dist.
//   SITE_BASE=/                  where the site is served (default "/")
//   SITE_STORYBOOK_URL=/storybook/  where Storybook is served (default "/storybook/"; a full URL also works)
// 1) SSR bundle of the pages (dist-ssr), 2) client build that prerenders every HTML page with it, 3) copy logo assets.
import { build } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { facts, storybook } from "./facts.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const define = { __STORYBOOK_URL__: JSON.stringify(storybook), __SITE_FACTS__: JSON.stringify(facts) };
const base = process.env.SITE_BASE ?? "/";

rmSync(root + "dist-ssr", { recursive: true, force: true });
await build({
  root,
  configFile: false,
  base,
  plugins: [react()],
  define,
  logLevel: "warn",
  ssr: { noExternal: true },
  build: { ssr: "src/entry-server.tsx", outDir: "dist-ssr", emptyOutDir: true },
});
await build({ root, configFile: root + "vite.config.ts", logLevel: "info" });
mkdirSync(root + "dist/brand", { recursive: true });
cpSync(root + "../../brand/assets", root + "dist/brand", { recursive: true });
cpSync(root + "../../brand/assets/favicon.ico", root + "dist/favicon.ico");
rmSync(root + "dist-ssr", { recursive: true, force: true });
console.log(`site: built to apps/site/dist (base ${base}, storybook ${storybook})`);
