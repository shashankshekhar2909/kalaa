import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { headScript } from "./src/head-script";
import { facts, storybook } from "./scripts/facts.mjs";

type Entry = {
  render: (name: string) => string;
  pages: Record<string, { title: string; description: string; file: string }>;
};

// Prerenders each HTML page with react-dom/server so the site reads without JavaScript. The SSR bundle is built first
// by scripts/build.mjs (dist-ssr/entry-server.js); in `vite dev` the module is loaded through the dev server instead.
function prerender(): Plugin {
  let server: ViteDevServer | undefined;
  let built: Entry | undefined;
  return {
    name: "kalaa-prerender",
    configureServer(s) {
      server = s;
    },
    async transformIndexHtml(html, ctx) {
      const entry: Entry = server
        ? ((await server.ssrLoadModule("/src/entry-server.tsx")) as unknown as Entry)
        : (built ??= (await import(
            pathToFileURL(join(import.meta.dirname, "dist-ssr/entry-server.js")).href
          )) as Entry);
      const file = ctx.path.replace(/^\//, "") || "index.html";
      const name = Object.keys(entry.pages).find((key) => entry.pages[key].file === file);
      if (!name) return html;
      const { title, description } = entry.pages[name];
      return {
        html: html.replace("<!--app-->", entry.render(name)),
        tags: [
          { tag: "script", children: headScript, injectTo: "head-prepend" },
          { tag: "title", children: title, injectTo: "head" },
          { tag: "meta", attrs: { name: "description", content: description }, injectTo: "head" },
        ],
      };
    },
  };
}

export default defineConfig({
  base: process.env.SITE_BASE ?? "/",
  plugins: [react(), prerender()],
  define: { __STORYBOOK_URL__: JSON.stringify(storybook), __SITE_FACTS__: JSON.stringify(facts) },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: ["index.html", "getting-started.html", "brand.html", "404.html"].map((f) =>
        join(import.meta.dirname, f),
      ),
    },
  },
});
