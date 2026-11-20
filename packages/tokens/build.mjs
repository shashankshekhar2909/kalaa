import StyleDictionary from "style-dictionary";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
const read = (file) => JSON.parse(readFileSync(new URL(file, import.meta.url)));
const palette = read("./src/palette.json").palette,
  foundation = read("./src/foundation.json"),
  mappings = read("./src/roles.json"),
  shapeSource = read("./src/shapes.json"),
  contrastSource = read("./src/contrast-pairs.json"),
  contrastPairs = contrastSource.pairs,
  chartContrastPairs = contrastSource.chartPairs ?? [];
const chartPalette = {
  categorical: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6", "chart-7", "chart-8"],
  sequential: ["chart-seq-1", "chart-seq-2", "chart-seq-3", "chart-seq-4", "chart-seq-5"],
  diverging: ["chart-div-1", "chart-div-2", "chart-div-3", "chart-div-4", "chart-div-5"],
  roles: [
    "chart-gridline",
    "chart-axis-text",
    "chart-tooltip-surface",
    "chart-tooltip-text",
    "chart-tooltip-border",
  ],
};
const accents = ["neel", "geru", "mayur"],
  modes = ["light", "dark"],
  themes = {};
for (const accent of accents) {
  themes[accent] = {};
  for (const mode of modes) {
    const roleTokens = {};
    for (const [role, ref] of Object.entries(mappings[mode])) {
      const path = ref.$value
        .replace("ACCENT", accent)
        .replace("NEUTRAL", `${accent}-neutral`)
        .replace("DANGER", accent === "geru" ? "crimson" : "red");
      roleTokens[role] = { $type: "color", $value: path };
    }
    // Style Dictionary resolves DTCG aliases for each theme.
    const sd = new StyleDictionary({
      tokens: { palette, role: roleTokens },
      platforms: { raw: { transforms: [] } },
    });
    const dictionary = await sd.getPlatformTokens("raw");
    themes[accent][mode] = Object.fromEntries(
      dictionary.allTokens.filter((t) => t.path[0] === "role").map((t) => [t.path[1], t.$value]),
    );
  }
}
// Shapes: the first entry is the default (:root); the others are opt-in via data-shape.
const shapes = Object.keys(shapeSource);
const flat = (obj, prefix = []) =>
  Object.entries(obj).flatMap(([k, v]) =>
    v.$value !== undefined ? [[[...prefix, k].join("-"), v.$value]] : flat(v, [...prefix, k]),
  );
const shapeVars = (shape) => flat(shapeSource[shape]);
const primitives = flat({ palette, ...foundation });
const vars = (entries) => entries.map(([k, v]) => `  --kalaa-${k}: ${v};`).join("\n");
const roleVars = (a, m) => vars(Object.entries(themes[a][m]));
// Selectors use attributes alone (specificity 0,1,0, same as :root), so they also work on nested wrappers
// such as <div data-accent="geru" data-theme="dark" data-shape="soft">. Later rules win on ties.
// Nested wrappers that change theme should also set data-accent when it is not Neel.
const accentSel = (a) => (a === "neel" ? `:root,\n[data-accent="neel"]` : `[data-accent="${a}"]`);
let css = `/* Generated from DTCG tokens. */\n:root {\n${vars(primitives)}\n}\n`;
css += `${shapes[0] === "square" ? ":root,\n" : ""}[data-shape="${shapes[0]}"] {\n${vars(shapeVars(shapes[0]))}\n}\n`;
for (const s of shapes.slice(1)) css += `[data-shape="${s}"] {\n${vars(shapeVars(s))}\n}\n`;
for (const a of accents) css += `${accentSel(a)} {\n${roleVars(a, "light")}\n  color-scheme: light;\n}\n`;
css += "@media (prefers-color-scheme: dark) {\n";
for (const a of accents) {
  const selector =
    a === "neel"
      ? ':root:not([data-theme="light"]),\n  [data-accent="neel"]:not([data-theme="light"])'
      : `[data-accent="${a}"]:not([data-theme="light"])`;
  css += `  ${selector} {\n${roleVars(a, "dark")}\n    color-scheme: dark;\n  }\n`;
}
css += "}\n";
// Forced modes (after the media query, so they win over the system preference).
for (const m of modes)
  for (const a of accents) {
    const sel =
      a === "neel"
        ? `:root[data-theme="${m}"],\n[data-accent="neel"][data-theme="${m}"],\n[data-theme="${m}"]:not([data-accent])`
        : `[data-accent="${a}"][data-theme="${m}"]`;
    css += `${sel} {\n${roleVars(a, m)}\n  color-scheme: ${m};\n}\n`;
  }
// A nested accent wrapper without its own data-theme follows an ancestor's forced theme (otherwise it would take the
// light or system value of its accent while the page is forced the other way).
for (const m of modes)
  for (const a of accents)
    css += `[data-theme="${m}"] [data-accent="${a}"]:not([data-theme]) {\n${roleVars(a, m)}\n  color-scheme: ${m};\n}\n`;
css +=
  "@media (prefers-reduced-motion: reduce) {\n  :root { --kalaa-duration-fast: 0ms; --kalaa-duration-base: 0ms; }\n}\n";
mkdirSync(new URL("./dist", import.meta.url), { recursive: true });
const write = (name, s) => writeFileSync(new URL(`./dist/${name}`, import.meta.url), s);
write("tokens.css", css);
write("tokens.json", JSON.stringify(themes, null, 2) + "\n");
// Self-hosted IBM Plex (SIL OFL 1.1) from the @fontsource packages: WOFF2 only, latin + latin-ext (+ devanagari for the
// Devanagari family), with each file's unicode-range so browsers fetch only what a page uses.
const families = [
  ["ibm-plex-sans", [400, 500, 600], ["latin", "latin-ext"]],
  ["ibm-plex-sans-devanagari", [400, 500, 600], ["devanagari"]],
  ["ibm-plex-serif", [400, 500], ["latin", "latin-ext"]],
  ["ibm-plex-mono", [400, 500], ["latin", "latin-ext"]],
];
const fontsDir = new URL("./dist/fonts/", import.meta.url);
mkdirSync(fontsDir, { recursive: true });
let fonts =
  "/* Generated by build.mjs from @fontsource/ibm-plex-* (SIL Open Font License 1.1; licences in ./fonts/). Self-hosted, no network. */\n";
for (const [pkg, weights, subsets] of families) {
  const dir = new URL(`./node_modules/@fontsource/${pkg}/`, import.meta.url);
  copyFileSync(new URL("LICENSE", dir), new URL(`LICENSE-${pkg}.txt`, fontsDir));
  for (const weight of weights) {
    const source = readFileSync(new URL(`${weight}.css`, dir), "utf8");
    for (const block of source.split("/* ").slice(1)) {
      const subset = subsets.find((s) => block.startsWith(`${pkg}-${s}-${weight}-normal`));
      if (!subset) continue;
      const file = `${pkg}-${subset}-${weight}-normal.woff2`;
      copyFileSync(new URL(`files/${file}`, dir), new URL(file, fontsDir));
      fonts += `@font-face {\n  font-family: '${block.match(/font-family: '([^']+)'/)[1]}';\n  font-style: normal;\n  font-display: swap;\n  font-weight: ${weight};\n  src: url(./fonts/${file}) format('woff2');\n  unicode-range: ${block.match(/unicode-range: ([^;]+);/)[1]};\n}\n`;
    }
  }
}
write("fonts.css", fonts);
write(
  "index.js",
  `export const accents = ${JSON.stringify(accents)};\nexport const contrastPairs = ${JSON.stringify(contrastPairs)};\nexport const chartContrastPairs = ${JSON.stringify(chartContrastPairs)};\nexport const chartPalette = ${JSON.stringify(chartPalette, null, 2)};\nexport const modes = ${JSON.stringify(modes)};\nexport const shapes = ${JSON.stringify(shapes)};\nexport const tokens = ${JSON.stringify(themes, null, 2)};\n`,
);
write(
  "index.d.ts",
  `export declare const accents: readonly ["neel", "geru", "mayur"];\nexport declare const modes: readonly ["light", "dark"];\nexport declare const shapes: readonly ${JSON.stringify(shapes)};\nexport type ContrastPair = readonly [Role, Role, number];\nexport declare const contrastPairs: readonly ContrastPair[];\nexport declare const chartContrastPairs: readonly ContrastPair[];\nexport declare const chartPalette: {\n  readonly categorical: readonly Role[];\n  readonly sequential: readonly Role[];\n  readonly diverging: readonly Role[];\n  readonly roles: readonly Role[];\n};\nexport type Shape = typeof shapes[number];\nexport type Accent = typeof accents[number];\nexport type Mode = typeof modes[number];\nexport type Role = ${Object.keys(
    themes.neel.light,
  )
    .map((x) => JSON.stringify(x))
    .join(" | ")};\nexport declare const tokens: Record<Accent, Record<Mode, Record<Role, string>>>;\n`,
);
