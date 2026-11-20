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

  it("extracts full story guidance and examples containing embedded quotes and template literals", () => {
    const manifest = buildManifest();
    const appShell = manifest.components.find((c) => c.name === "AppShell");
    expect(appShell).toBeDefined();
    expect(appShell?.purpose).toContain('Pass `render={<NextLink href="..." />}` on `NavItem`');
    expect(appShell?.example).toContain('import NextLink from "next/link";');
    expect(appShell?.example).toContain('render={<NextLink href="/products" />}');

    const fixture = parseComponentSource({
      componentName: "QuoteFixture",
      tsxSource: `
        export type QuoteFixtureProps = {
          /** Label text. */
          label: string;
        };
        export function QuoteFixture({ label = "default" }: QuoteFixtureProps) {
          return null;
        }
      `,
      storiesSource: `
        const EXTRA = "client-side routing";
        export default {
          title: 'Blocks/Custom/QuoteFixture',
          parameters: {
            docs: {
              description: {
                component: \`First paragraph with "double" and 'single' quotes plus \${EXTRA}.

**Usage**

\\\`\\\`\\\`tsx
import { QuoteFixture } from "@kalaa/react";

<QuoteFixture label='Embedded "quotes" inside single' />
\\\`\\\`\\\`\`,
              },
            },
          },
        };
      `,
    });

    expect(fixture.category).toBe("Blocks/Custom");
    expect(fixture.purpose).toBe(
      `First paragraph with "double" and 'single' quotes plus client-side routing.`,
    );
    expect(fixture.example).toContain(`<QuoteFixture label='Embedded "quotes" inside single' />`);
  });

  it("ignores braces inside JSDoc and inline comments when scanning type declarations", () => {
    const parsed = parseComponentSource({
      componentName: "BraceCommentFixture",
      tsxSource: `
        export interface BaseBraceProps {
          /** Base prop with JSDoc braces \`{ base: true }\` and unmatched \`{\`. */
          baseId?: string;
        }

        /**
         * Component JSDoc with braces: \`render={<Link href="/x" />}\` and \`{ nested: { ok: 1 } }\`.
         */
        export type BraceCommentFixtureProps = BaseBraceProps & /* comment with { unmatched brace */ {
          // Single-line comment with { and } braces
          /**
           * Callback prop with JSDoc example:
           * \`onAction({ id: "1", meta: { count: 2 } })\` and unmatched \`}\`.
           */
          onAction: (payload: { id: string; count?: number }) => void;
          /** Optional mode after braced prop. */
          mode?: "compact" | "comfortable";
        };

        export function BraceCommentFixture({
          baseId = "b-1",
          onAction,
          mode = "comfortable",
        }: BraceCommentFixtureProps) {
          return null;
        }
      `,
    });

    expect(parsed.purpose).toContain('render={<Link href="/x" />}');
    expect(parsed.props).toEqual([
      {
        name: "baseId",
        type: "string",
        required: false,
        default: '"b-1"',
        description: "Base prop with JSDoc braces `{ base: true }` and unmatched `{`.",
      },
      {
        name: "onAction",
        type: "(payload: { id: string; count?: number }) => void",
        required: true,
        default: null,
        description:
          'Callback prop with JSDoc example: `onAction({ id: "1", meta: { count: 2 } })` and unmatched `}`.',
      },
      {
        name: "mode",
        type: '"compact" | "comfortable"',
        required: false,
        default: '"comfortable"',
        description: "Optional mode after braced prop.",
      },
    ]);
  });
});
