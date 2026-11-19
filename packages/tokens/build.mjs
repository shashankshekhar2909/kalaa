import StyleDictionary from "style-dictionary";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const read = (file) => JSON.parse(readFileSync(new URL(file, import.meta.url)));
const palette = read("./src/palette.json").palette,
  foundation = read("./src/foundation.json"),
  mappings = read("./src/roles.json"),
  shapeSource = read("./src/shapes.json");
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
css +=
  "@media (prefers-reduced-motion: reduce) {\n  :root { --kalaa-duration-fast: 0ms; --kalaa-duration-base: 0ms; }\n}\n";
mkdirSync(new URL("./dist", import.meta.url), { recursive: true });
const write = (name, s) => writeFileSync(new URL(`./dist/${name}`, import.meta.url), s);
write("tokens.css", css);
write("tokens.json", JSON.stringify(themes, null, 2) + "\n");
write(
  "fonts.css",
  `/* Google Fonts for now; self-hosting comes later. */\n@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Devanagari:wght@400;600&family=IBM+Plex+Serif:wght@400;500&display=swap');\n`,
);
write(
  "index.js",
  `export const accents = ${JSON.stringify(accents)};\nexport const modes = ${JSON.stringify(modes)};\nexport const shapes = ${JSON.stringify(shapes)};\nexport const tokens = ${JSON.stringify(themes, null, 2)};\n`,
);
write(
  "index.d.ts",
  `export declare const accents: readonly ["neel", "geru", "mayur"];\nexport declare const modes: readonly ["light", "dark"];\nexport declare const shapes: readonly ${JSON.stringify(shapes)};\nexport type Shape = typeof shapes[number];\nexport type Accent = typeof accents[number];\nexport type Mode = typeof modes[number];\nexport type Role = ${Object.keys(
    themes.neel.light,
  )
    .map((x) => JSON.stringify(x))
    .join(" | ")};\nexport declare const tokens: Record<Accent, Record<Mode, Record<Role, string>>>;\n`,
);
