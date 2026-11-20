import { describe, expect, it } from "vitest";
import {
  buildManifest,
  formatLlmsTxt,
  parseComponentSource,
  readCommittedManifest,
} from "../../scripts/ai-manifest.mjs";

describe("AI manifest (components.json and llms.txt)", () => {
  it("matches the committed components.json and llms.txt generated from source/JSDoc", () => {
    const manifest = buildManifest();
    const committed = readCommittedManifest();

    const laneCCategories = new Set([
      "Templates",
      "Blocks/Resume",
      "Blocks/Profile & portfolio",
      "Blocks/Marketing",
    ]);
    const generatedLaneC = manifest.components.filter((c) => laneCCategories.has(c.category));
    const committedLaneC = committed.json.components.filter((c) => laneCCategories.has(c.category));
    expect(committedLaneC).toEqual(generatedLaneC);
    expect(generatedLaneC.length).toBeGreaterThanOrEqual(25);

    expect(committed.json).toEqual(manifest);
    expect(committed.llmsTxt).toBe(formatLlmsTxt(manifest));
  });

  it("detects staleness when a component prop, default or JSDoc changes", () => {
    const manifest = buildManifest();
    const resumeHeader = manifest.components.find((c) => c.name === "ResumeHeader");
    expect(resumeHeader).toBeDefined();

    const mutated = parseComponentSource({
      componentName: "ResumeHeader",
      tsxSource: `
        export type ResumeHeaderProps = {
          /** Candidate full name (rendered as h1). */
          name: string;
          /** Added drifted prop that is not in components.json. */
          driftedProp?: string;
        };
        /** Drifted description. */
        export function ResumeHeader({ name, driftedProp = "stale" }: ResumeHeaderProps) {
          return null;
        }
      `,
    });

    expect(mutated).not.toEqual(resumeHeader);
    expect(mutated.props.find((p) => p.name === "driftedProp")?.default).toBe('"stale"');
  });
});
