import { tokens } from "@kalaa/tokens";

export const DEFAULT_ORIGIN = "https://kalaa.buildwithshashank.com";
export const SITE_AUTHOR = "Shashank Shekhar, buildwithShashank";
export const ORGANIZATION = {
  name: "buildwithShashank",
  url: "https://buildwithshashank.com",
} as const;
export const AUTHOR_PERSON = {
  "@type": "Person",
  name: "Shashank Shekhar",
  url: ORGANIZATION.url,
} as const;
export const LICENSE_URL = "https://spdx.org/licenses/Apache-2.0";

// Derived from Kalaa Neel role tokens (no hardcoded colour literals): light accent for light chrome, dark canvas for dark chrome.
export const THEME_COLORS = {
  light: tokens.neel.light.accent,
  dark: tokens.neel.dark.bg,
} as const;

export function robotsContent(file: string): string {
  return file === "404.html" ? "noindex,follow" : "index,follow,max-image-preview:large";
}

function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildJsonLd(opts: {
  origin: string;
  socialImage: string;
  pageName: string;
  file: string;
  title: string;
  description: string;
  version: string;
}): string | null {
  const { origin, socialImage, pageName, file, title, description, version } = opts;
  if (file === "404.html" || pageName === "not-found") return null;

  const orgId = `${ORGANIZATION.url}/#organization`;
  const websiteId = `${origin}/#website`;
  const homeUrl = `${origin}/`;

  if (pageName === "home" || file === "index.html") {
    return serializeJsonLd({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": orgId,
          name: ORGANIZATION.name,
          url: ORGANIZATION.url,
          founder: AUTHOR_PERSON,
        },
        {
          "@type": "WebSite",
          "@id": websiteId,
          name: "Kalaa",
          url: homeUrl,
          description,
          inLanguage: "en",
          publisher: { "@id": orgId },
        },
        {
          "@type": "SoftwareSourceCode",
          "@id": `${origin}/#kalaa`,
          name: "Kalaa",
          description,
          url: homeUrl,
          programmingLanguage: ["TypeScript", "CSS"],
          runtimePlatform: "React",
          version,
          license: LICENSE_URL,
          image: socialImage,
          author: AUTHOR_PERSON,
          publisher: { "@id": orgId },
        },
      ],
    });
  }

  const pageUrl = `${origin}/${file}`;
  const crumbName = title.split("|")[0].trim() || title;
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  return serializeJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        inLanguage: "en",
        isPartOf: {
          "@type": "WebSite",
          "@id": websiteId,
          name: "Kalaa",
          url: homeUrl,
        },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Kalaa",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: crumbName,
            item: pageUrl,
          },
        ],
      },
    ],
  });
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildSitemapXml(origin: string, paths: readonly string[], lastmod: string): string {
  const base = origin.replace(/\/$/, "");
  const entries = paths.map((path) => {
    const loc =
      path.startsWith("http://") || path.startsWith("https://")
        ? path
        : `${base}${path.startsWith("/") ? path : `/${path}`}`;
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(lastmod)}</lastmod>\n  </url>`;
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");
}

export function buildRobotsTxt(origin: string): string {
  const base = origin.replace(/\/$/, "");
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /storybook/iframe.html",
    "",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n");
}
