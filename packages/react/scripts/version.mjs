import { readFileSync, writeFileSync } from "node:fs";

// KALAA_VERSION in src/util.ts must equal package.json. `--write` syncs it (run after `changeset version`).
const version = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version;
const file = new URL("../src/util.ts", import.meta.url);
const source = readFileSync(file, "utf8");
const pattern = /export const KALAA_VERSION = "([^"]+)";/;
const exported = pattern.exec(source)?.[1];

if (process.argv.includes("--write")) {
  if (!exported) throw new Error("KALAA_VERSION not found in src/util.ts");
  if (exported !== version)
    writeFileSync(file, source.replace(pattern, `export const KALAA_VERSION = "${version}";`));
} else if (exported !== version) {
  console.error(`KALAA_VERSION (${exported ?? "missing"}) must match package.json (${version}).`);
  process.exitCode = 1;
}
