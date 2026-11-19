# P0 brief (codex, frontend-engineer role): tokens pipeline, react package skeleton, Storybook

Read docs/PLAN.md (decisions D1-D8, "Token architecture") and docs/foundations-draft.md first.
Environment: run `. bin/env.sh` before ANY node/pnpm command (Node 26 + pnpm 12 live there; system Node 20 is too old).
All dependencies are already installed; you have no network: do not run `pnpm add/install`. Do not git commit.
Plain read commands (cat, rg, ls, sed) are fine.

## 1. packages/tokens

Source in DTCG JSON (`$value`, `$type`) under `packages/tokens/src/`, built with Style Dictionary 5 (installed) by
`packages/tokens/build.mjs`. Three layers:

- **palette**: ramps 50,100,...,900,950 for `neel`, `geru`, `mayur`; one neutral ramp per accent (`neel-neutral`, ...,
  slight hue bias toward its accent); status ramps `green`, `amber`, `red`, `crimson`. The role values below MUST appear
  exactly as ramp steps (anchors); fill the other steps by interpolating in OKLCH with a small dependency-free script
  `packages/tokens/scripts/ramps.mjs` that writes `src/palette.json` (commit both the script and its output).
- **roles** (semantic): accent, accent-hover, accent-soft, on-accent, bg, surface, surface-alt, border, border-strong,
  text, text-muted, text-subtle, success, success-soft, warning, warning-soft, danger, danger-soft, focus. Each role
  maps to a palette step per accent x mode (light/dark). Values (anchors):

| Role                                                                                                                   | Neel light | Neel dark | Geru light | Geru dark | Mayur light | Mayur dark |
| ---------------------------------------------------------------------------------------------------------------------- | ---------- | --------- | ---------- | --------- | ----------- | ---------- |
| bg                                                                                                                     | #F4F4F0    | #10121C   | #F6F1EB    | #16110F   | #F1F5F3     | #0C1517    |
| surface                                                                                                                | #FFFFFF    | #171A28   | #FFFDFA    | #1F1815   | #FFFFFF     | #121E21    |
| text                                                                                                                   | #1B1F33    | #E6E7EF   | #2A1E19    | #F0E7E1   | #13262A     | #E2EDEC    |
| text-muted                                                                                                             | #5B6075    | #A2A6BC   | #6C5D55    | #B6A69C   | #536A6E     | #9DB3B3    |
| border                                                                                                                 | #E1E1DA    | #2A2E44   | #E7DDD2    | #3A2D27   | #DBE4E1     | #24363A    |
| accent                                                                                                                 | #2E3A8C    | #9EA9F2   | #9A3E21    | #EE9473   | #0E676D     | #62C3C4    |
| accent-hover                                                                                                           | #232D6E    | #B9C1F6   | #7D3119    | #F3AE95   | #0A5055     | #86D3D4    |
| accent-soft                                                                                                            | #E6E8F5    | #1F2546   | #F4E2D9    | #3A2219   | #DCEEEE     | #133437    |
| on-accent                                                                                                              | #FFFFFF    | #10121C   | #FFFFFF    | #16110F   | #FFFFFF     | #0C1517    |
| surface-alt, border-strong, text-subtle: choose from the neutral ramp (surface-alt one step off bg; border-strong must |
| reach 3:1 against surface; text-subtle >= 4.5:1 on surface). focus = accent.                                           |
| Status (all accents): light success #1F7A4D / soft #E4F3EA, warning #94600A / #FBF0DC, danger #B42318 / #FBE7E4;       |
| dark success #64C793 / #14301F, warning #E6B450 / #33270F, danger #F0857B / #3A1715.                                   |
| **Geru override**: danger uses crimson: light #A3184A / soft #F8E1EA, dark #F27DA6 / #3A1424 (it sits too close to     |
| red ochre otherwise).                                                                                                  |

- **non-colour tokens**: font families (sans "IBM Plex Sans", "IBM Plex Sans Devanagari", system-ui, sans-serif;
  serif "IBM Plex Serif", Georgia, serif; mono "IBM Plex Mono", ui-monospace, monospace), font sizes xs 12 / sm 13 /
  base 14 / md 16 / lg 20 / xl 26 / 2xl 34 px, weights 400/500/600, line heights 1.5 body / 1.25 heading, space 4 px
  scale (1=4 ... 8=32, 10=40, 12=48), radius sm 6 / md 8 / lg 12 / full 999, shadow-1 `0 1px 2px rgb(16 24 40 / 0.05)`,
  shadow-2 `0 8px 24px rgb(16 24 40 / 0.12)`, control height sm 30 / md 36 / lg 44, motion duration fast 120ms /
  base 200ms, easing standard cubic-bezier(0.2, 0, 0, 1).

Outputs (`packages/tokens/dist/`, all generated by `pnpm --filter @kalaa/tokens build`):

- `tokens.css`: every token as `--kalaa-*` custom properties. `:root` = Neel light + all non-colour tokens;
  `[data-accent="geru"]`, `[data-accent="mayur"]` swap role colours; dark for each accent under both
  `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) ... }` and `[data-theme="dark"]` (with
  `color-scheme: dark`). Combined selectors must work on the `<html>` element (`:root[data-accent="geru"][data-theme="dark"]` etc.).
  Also a `prefers-reduced-motion` block that sets durations to 0ms.
- `fonts.css`: `@import` of Google Fonts for IBM Plex Sans 400/500/600, Serif 400/500, Mono 400/500, Sans Devanagari
  400/600 with `display=swap` (self-hosting comes later; leave a comment).
- `tokens.json` (resolved values per accent x mode), `index.js` + `index.d.ts` (typed constants and the accent/mode lists).
- package.json: `exports` for `./tokens.css`, `./fonts.css`, `./tokens.json`, `.` (index); `files: ["dist"]`;
  scripts `build` (ramps -> SD build -> contrast check) and `check` (contrast only).
- `packages/tokens/scripts/check-contrast.mjs` (no dependencies): for every accent x mode check WCAG 2.2 ratios:
  > = 4.5 for text/bg, text/surface, text-muted/bg, text-muted/surface, text-subtle/surface, accent/bg, accent/surface,
  > on-accent/accent, accent/accent-soft, success/success-soft, warning/warning-soft, danger/danger-soft, danger/surface;
  > = 3 for border-strong/surface and focus/bg. Print a table; exit 1 on any failure. If an anchor pair above fails,
  > do not silently change the anchor: report it.

## 2. packages/react (skeleton only; components are P1)

- `src/index.ts` exports `cx(...classes)` (class joiner) and `KALAA_VERSION`; `src/styles.css` imports nothing yet.
- Build: tsup for JS (ESM, `external: ["react","react-dom","@base-ui/react"]`, banner `"use client";`, sourcemap),
  and `tsc -p tsconfig.build.json --emitDeclarationOnly` for `.d.ts` (TypeScript 7 is installed; do NOT use tsup's dts
  option). package.json: peerDependencies react/react-dom ^19, exports `.` (types + import) and `./styles.css`,
  `files: ["dist"]`, scripts `build`, `check` (tsc --noEmit).

## 3. apps/storybook (Storybook 10, react-vite)

- `.storybook/main.ts`: framework `@storybook/react-vite`, addons `@storybook/addon-a11y`, `@storybook/addon-docs`;
  stories from `../../../packages/react/src/**/*.stories.tsx` and `../stories/**/*.stories.tsx`.
- `.storybook/preview.ts(x)`: import `@kalaa/tokens/fonts.css` and `@kalaa/tokens/tokens.css`; toolbar globals
  **Theme** (system/light/dark -> `data-theme` on `<html>`, none for system) and **Accent** (neel/geru/mayur ->
  `data-accent`, none for neel); canvas background uses `var(--kalaa-bg)`; a11y addon runs on every story.
- Stories (`apps/storybook/stories/`): `Foundations/Colour` (role swatches for the active accent and mode, each with
  its live contrast ratio against its pair, computed in the browser from getComputedStyle), `Foundations/Palette`
  (all ramps), `Foundations/Typography` (scale with sample text incl. a Devanagari line "कला" and a table column of
  tabular numbers), `Foundations/Space, radius, shadow`. Calm, sentence-case UI built from the tokens; no hex values in
  story CSS.
- package.json scripts: `dev` = `storybook dev -p 6006 --no-open`, `build` = `storybook build -o storybook-static`.

## 4. Repo

- `.changeset/config.json` (Changesets 3, baseBranch main, access restricted) and a short `.changeset/README.md`.
- `docs/tokens.md`: how the layers work, how to switch accent/theme, how to add an accent.
- `tsconfig.base.json` at the root (strict, moduleResolution bundler, jsx react-jsx), extended by packages.

## Verify (all must pass) and report

`. bin/env.sh && pnpm build && pnpm check && pnpm build-storybook`
Report: files created, the contrast table summary (any failures with values), and anything you could not do.
