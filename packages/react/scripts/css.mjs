// Joins src/components/*/*.css into dist/styles.css and enforces the CSS rules:
// every class selector starts with "kl-", and colours come only from --kalaa-* tokens (no hex/rgb/hsl literals).
//   node scripts/css.mjs           build + check
//   node scripts/css.mjs --check   check only
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../src/components/", import.meta.url).pathname;
const files = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => readdirSync(join(root, d.name)).filter((f) => f.endsWith(".css")).map((f) => join(root, d.name, f)))
  .sort();
const errors = [];
let out = "/* @kalaa/react styles (generated) */\n";
for (const file of files) {
  const css = readFileSync(file, "utf8");
  const name = file.slice(root.length);
  const body = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of body.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) if (!m[1].startsWith("kl-")) errors.push(`${name}: class ".${m[1]}" must start with "kl-"`);
  for (const m of body.matchAll(/#[0-9a-fA-F]{3,8}\b|\b(?:rgb|hsl|oklch)a?\(/g)) errors.push(`${name}: colour literal "${m[0]}"; use a --kalaa-* token`);
  out += `\n/* ${name} */\n${css}`;
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
if (!process.argv.includes("--check")) {
  mkdirSync(new URL("../dist/", import.meta.url), { recursive: true });
  writeFileSync(new URL("../dist/styles.css", import.meta.url), out);
}
console.log(`css: ${files.length} component file(s) ${process.argv.includes("--check") ? "checked" : "joined"}`);
