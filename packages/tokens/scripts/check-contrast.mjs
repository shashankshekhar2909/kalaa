import { readFileSync } from "node:fs";
const themes = JSON.parse(readFileSync(new URL("../dist/tokens.json", import.meta.url)));
const contrastSource = JSON.parse(readFileSync(new URL("../src/contrast-pairs.json", import.meta.url)));
const pairs = [...contrastSource.pairs, ...(contrastSource.chartPairs ?? [])];
function luminance(hex) {
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
let failed = false;
console.log("Accent  Mode   Pair                         Ratio  Required  Result");
for (const [accent, modes] of Object.entries(themes))
  for (const [mode, roles] of Object.entries(modes))
    for (const [a, b, min] of pairs) {
      const l1 = luminance(roles[a]),
        l2 = luminance(roles[b]),
        ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05),
        pass = ratio >= min;
      failed ||= !pass;
      console.log(
        `${accent.padEnd(7)} ${mode.padEnd(6)} ${(a + "/" + b).padEnd(28)} ${ratio.toFixed(2).padStart(5)}  ${min.toFixed(1).padStart(8)}  ${pass ? "PASS" : "FAIL"}${pass ? "" : ` (${roles[a]} / ${roles[b]})`}`,
      );
    }
if (failed) process.exitCode = 1;
// Hierarchy: each tier must be visibly lighter than the one above it (on surface), so roles cannot collapse into
// one grey while still passing the minimums above. Ratios are measured against surface.
const tiers = [
  ["text", "text-muted"],
  ["text-muted", "text-subtle"],
  ["text-subtle", "border-strong"],
  ["border-strong", "border"],
];
const vs = (roles, a) => {
  const l1 = luminance(roles[a]),
    l2 = luminance(roles.surface);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
for (const [accent, modes] of Object.entries(themes))
  for (const [mode, roles] of Object.entries(modes))
    for (const [hi, lo] of tiers) {
      const a = vs(roles, hi),
        b = vs(roles, lo),
        pass = a >= b * 1.1;
      if (!pass) {
        process.exitCode = 1;
      }
      console.log(
        `${accent.padEnd(7)} ${mode.padEnd(6)} ${(hi + " > " + lo).padEnd(28)} ${a.toFixed(2).padStart(5)} > ${b.toFixed(2)}  ${pass ? "PASS" : "FAIL (tiers too close)"}`,
      );
    }
