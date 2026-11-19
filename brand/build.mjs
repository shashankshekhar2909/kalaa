// Generates the static logo files in brand/assets from the same geometry as the Logo component
// (packages/react/src/components/Logo/Logo.tsx). Colours come from the Geru ramps; contrast is checked with the
// same luminance function as packages/tokens/scripts/check-contrast.mjs.
//   node brand/build.mjs
import { chromium } from "@playwright/test";
import opentype from "opentype.js";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const out = new URL("./assets/", import.meta.url);
mkdirSync(out, { recursive: true });
const palette = JSON.parse(
  readFileSync(new URL("../packages/tokens/src/palette.json", import.meta.url)),
).palette;
const p = (ramp, step) => palette[ramp][step].$value;
const colours = {
  light: {
    frame: p("geru-neutral", 900),
    lit: p("geru", 700),
    bg: p("geru-neutral", 50),
    paper: p("geru-neutral", 0),
  },
  dark: { frame: p("geru-neutral", 100), lit: p("geru", 400), bg: p("geru-neutral", 950) },
};

function luminance(hex) {
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
for (const [mode, c] of Object.entries(colours))
  for (const [name, fg] of [
    ["frame", c.frame],
    ["lit", c.lit],
  ]) {
    const r = ratio(fg, c.bg);
    console.log(`${mode} ${name} ${fg} on ${c.bg}: ${r.toFixed(2)}:1`);
    if (r < 3) throw new Error(`logo ${mode} ${name} below 3:1`);
  }

const FRAME = "M2 2H30V30H2Z M4 4V28H28V4Z";
const LIT = "M6 6H14V18H26V26H6Z";
const mark = (frame, lit) =>
  `<path fill="${frame}" fill-rule="evenodd" d="${FRAME}"/><path fill="${lit}" d="${LIT}"/>`;
const svg = (w, body, label = "Kalaa", extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 32" width="${w}" height="32" role="img" aria-label="${label}">${extra}${body}</svg>\n`;
const write = (name, s) => writeFileSync(new URL(name, out), s);

write("logo-mark.svg", svg(32, mark(colours.light.frame, colours.light.lit)));
write("logo-mark-dark.svg", svg(32, mark(colours.dark.frame, colours.dark.lit)));
write("logo-mono.svg", svg(32, mark("currentColor", "currentColor")));

// Wordmark: "Kalaa" in IBM Plex Serif 500, outlined (no font needed), 0.75 of the mark height, 0.25 gap,
// baseline on the bottom edge of the L (y = 26), letter-spacing -0.01em.
const fontFile = readFileSync(
  new URL(
    "../packages/tokens/node_modules/@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-500-normal.woff",
    import.meta.url,
  ),
);
const font = opentype.parse(
  fontFile.buffer.slice(fontFile.byteOffset, fontFile.byteOffset + fontFile.byteLength),
);
const size = 24;
const textX = 32 + 8;
const textPath = font.getPath("Kalaa", textX, 26, size, { letterSpacing: -0.01 });
const width = Math.ceil(textPath.getBoundingBox().x2 + 2);
const word = (c) =>
  svg(width, `${mark(c.frame, c.lit)}<path fill="${c.frame}" d="${textPath.toPathData(2)}"/>`);
write("logo-wordmark.svg", word(colours.light));
write("logo-wordmark-dark.svg", word(colours.dark));
console.log(`wordmark viewBox 0 0 ${width} 32`);

const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>.f{fill:${colours.light.frame}}.l{fill:${colours.light.lit}}@media (prefers-color-scheme:dark){.f{fill:${colours.dark.frame}}.l{fill:${colours.dark.lit}}}</style><path class="f" fill-rule="evenodd" d="${FRAME}"/><path class="l" d="${LIT}"/></svg>\n`;
write("favicon.svg", fav);

// Raster: favicon.ico (16 + 32 PNGs) and apple-touch-icon.png (180, opaque paper background, mark at 120).
const browser = await chromium.launch();
const page = await browser.newPage();
async function png(px, pad, bg) {
  const inner = px - 2 * pad;
  await page.setViewportSize({ width: px, height: px });
  await page.setContent(
    `<body style="margin:0;background:${bg ?? "transparent"};display:grid;place-items:center;width:${px}px;height:${px}px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${inner}" height="${inner}" shape-rendering="crispEdges">${mark(colours.light.frame, colours.light.lit)}</svg></body>`,
  );
  return page.screenshot({ omitBackground: !bg, type: "png" });
}
const pngs = [await png(16, 0), await png(32, 0)];
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((data, i) => {
  const at = 6 + 16 * i,
    px = i === 0 ? 16 : 32;
  header[at] = px;
  header[at + 1] = px;
  header.writeUInt16LE(1, at + 4);
  header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(data.length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += data.length;
});
writeFileSync(new URL("favicon.ico", out), Buffer.concat([header, ...pngs]));
writeFileSync(new URL("apple-touch-icon.png", out), await png(180, 30, colours.light.bg));
writeFileSync(new URL("logo-mark-512.png", out), await png(512, 0));
await browser.close();
