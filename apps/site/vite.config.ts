import react from "@vitejs/plugin-react";
import { defineConfig, type HtmlTagDescriptor, type Plugin, type ViteDevServer } from "vite";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { headScript } from "./src/head-script";
import { DEFAULT_GTM_ID, gtmHeadScript, gtmNoscriptIframeHtml, resolveGtmId } from "./src/gtm";
import {
  DEFAULT_ORIGIN,
  SITE_AUTHOR,
  THEME_COLORS,
  buildJsonLd,
  buildRobotsTxt,
  buildSitemapXml,
  robotsContent,
} from "./src/seo";
import { facts, storybook } from "./scripts/facts.mjs";

type Entry = {
  render: (name: string) => string;
  pages: Record<string, { title: string; description: string; file: string }>;
};

const ORIGIN = (process.env.SITE_ORIGIN ?? DEFAULT_ORIGIN).replace(/\/$/, "");
const SOCIAL_IMAGE = `${ORIGIN}/brand/og.png`;
const GTM_ID = resolveGtmId(process.env.SITE_GTM_ID ?? DEFAULT_GTM_ID);
const SITEMAP_PATHS = [
  "/",
  "/getting-started.html",
  "/brand.html",
  storybook.startsWith("/") ? (storybook.endsWith("/") ? storybook : `${storybook}/`) : "/storybook/",
] as const;

function social(title: string, description: string, file: string): HtmlTagDescriptor[] {
  const url = `${ORIGIN}/${file === "index.html" ? "" : file}`;
  const meta = (attr: "property" | "name", key: string, content: string): HtmlTagDescriptor => ({
    tag: "meta",
    attrs: { [attr]: key, content },
    injectTo: "head",
  });
  return [
    meta("property", "og:type", "website"),
    meta("property", "og:locale", "en"),
    meta("property", "og:site_name", "Kalaa"),
    meta("property", "og:title", title),
    meta("property", "og:description", description),
    meta("property", "og:url", url),
    meta("property", "og:image", SOCIAL_IMAGE),
    meta("property", "og:image:width", "1200"),
    meta("property", "og:image:height", "627"),
    meta("property", "og:image:alt", "Kalaa: a calm design system for operational software"),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", title),
    meta("name", "twitter:description", description),
    meta("name", "twitter:image", SOCIAL_IMAGE),
    { tag: "link", attrs: { rel: "canonical", href: url }, injectTo: "head" },
  ];
}

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
      const jsonLd = buildJsonLd({
        origin: ORIGIN,
        socialImage: SOCIAL_IMAGE,
        pageName: name,
        file,
        title,
        description,
        version: facts.version,
      });
      const tags: HtmlTagDescriptor[] = [
        // Apply stored theme/accent/shape preferences first so first paint never flashes.
        { tag: "script", children: headScript, injectTo: "head-prepend" },
        ...(GTM_ID
          ? [
              { tag: "script", children: gtmHeadScript(GTM_ID), injectTo: "head-prepend" as const },
              {
                tag: "noscript",
                children: gtmNoscriptIframeHtml(GTM_ID),
                injectTo: "body-prepend" as const,
              },
            ]
          : []),
        { tag: "title", children: title, injectTo: "head" },
        { tag: "meta", attrs: { name: "description", content: description }, injectTo: "head" },
        { tag: "meta", attrs: { name: "robots", content: robotsContent(file) }, injectTo: "head" },
        { tag: "meta", attrs: { name: "author", content: SITE_AUTHOR }, injectTo: "head" },
        {
          tag: "meta",
          attrs: { name: "theme-color", media: "(prefers-color-scheme: light)", content: THEME_COLORS.light },
          injectTo: "head",
        },
        {
          tag: "meta",
          attrs: { name: "theme-color", media: "(prefers-color-scheme: dark)", content: THEME_COLORS.dark },
          injectTo: "head",
        },
        {
          tag: "link",
          attrs: {
            rel: "sitemap",
            type: "application/xml",
            title: "Sitemap",
            href: `${ORIGIN}/sitemap.xml`,
          },
          injectTo: "head",
        },
        // Link previews (LinkedIn, Slack, X): absolute URLs, 1200x627 image.
        ...social(title, description, file),
        ...(jsonLd
          ? [
              {
                tag: "script",
                attrs: { type: "application/ld+json" },
                children: jsonLd,
                injectTo: "head" as const,
              },
            ]
          : []),
      ];
      return {
        html: html.replace("<!--app-->", entry.render(name)),
        tags,
      };
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: buildSitemapXml(ORIGIN, SITEMAP_PATHS, facts.built),
      });
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: buildRobotsTxt(ORIGIN),
      });
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
