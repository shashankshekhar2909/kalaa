declare const __STORYBOOK_URL__: string;
declare const __SITE_FACTS__: SiteFacts;
export type SiteFacts = {
  version: string;
  built: string;
  components: number;
  accents: number;
  modes: number;
  contrastChecks: number;
  quality: null | { scans: number; failed: number; at: string };
};
/** Site base (from Vite's `base`, default "/"). All internal links are built from it, so the site can be served anywhere. */
export const base = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
/** Where Storybook is served. Set SITE_STORYBOOK_URL at build time; default is /storybook/. */
export const storybook = __STORYBOOK_URL__.endsWith("/") ? __STORYBOOK_URL__ : `${__STORYBOOK_URL__}/`;
export const facts: SiteFacts = __SITE_FACTS__;
export const page = (name: string) => `${base}${name}`;
/** Link into Storybook (manager UI), for example sb("story", "foundations-shape--square-and-soft"). */
export const sb = (kind: "story" | "docs", id: string) => `${storybook}?path=/${kind}/${id}`;
export const asset = (file: string) => `${base}brand/${file}`;
