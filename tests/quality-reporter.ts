import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

// Writes apps/site/quality.json after a run: how many axe scans ran and how many failed, per suite. The site build
// reads it for the "axe scans" fact, so the number is never typed by hand. Partial runs only update the suites they ran.
const file = "apps/site/quality.json";
export default class QualityReporter implements Reporter {
  private suites: Record<string, { scans: number; failed: number }> = {};
  onTestEnd(test: TestCase, result: TestResult) {
    if (test.title.startsWith("smoke story exists") || result.status === "skipped") return;
    const suite = test.location.file.includes("site.spec") ? "site" : "stories";
    const entry = (this.suites[suite] ??= { scans: 0, failed: 0 });
    if (!test.annotations.some((a) => a.type === "scan")) return;
    entry.scans++;
    if (result.status !== "passed") entry.failed++;
  }
  onEnd(_result: FullResult) {
    const previous = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
    const at = new Date().toISOString().slice(0, 10);
    for (const [name, entry] of Object.entries(this.suites))
      if (entry.scans) previous[name] = { ...entry, at };
    writeFileSync(file, JSON.stringify(previous, null, 2) + "\n");
  }
}
