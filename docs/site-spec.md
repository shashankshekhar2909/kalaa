# Kalaa site, logo and Storybook recalibration: spec (2026-11-20)

Author: product-designer agent (read-only repo review, no browsing). Storybook 10.6.7 theming APIs (`storybook/theming`,
`addons.setConfig`, `storySort`) were written from memory: verify against the 10.6 docs before implementing.
Main-session decisions are marked **Decision**.

**Decision (2026-11-20):** shape values are `square` (default, no attribute) and `soft` (`data-shape="soft"`).
Accent/theme/shape selectors work on nested wrappers too (low-specificity `:where(...)`), so the site can show
square vs soft and three accents side by side live. Open questions (section 5) use the defaults listed there until
Shashank answers.

## 1. Unique features (verified against the repo)

| #   | Feature                                                                                                                                                                                                                                                            | Evidence                                                       | Caveat                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | Three Indian-pigment accents: Neel (indigo #2E3A8C, dark #9EA9F2), Geru (red ochre #9A3E21, dark #EE9473), Mayur (peacock teal #0E676D, dark #62C3C4). Each has a neutral ramp hue-biased to its accent, so the whole surface family shifts, not only the buttons. | `packages/tokens/scripts/ramps.mjs`, `docs/PLAN.md` D6         | Neel = app default; Geru = brand colour outside apps.                                    |
| 2   | Contrast is a build gate: 16 role pairs x 3 accents x 2 modes = 96 checks at AA (4.5:1 text, 3:1 UI). The build fails below AA; anchors may not be silently adjusted.                                                                                              | `packages/tokens/scripts/check-contrast.mjs`, `docs/tokens.md` | Pair list duplicated in `stories/Colour.stories.tsx` (change 11).                        |
| 3   | DTCG JSON resolved by Style Dictionary 5.8.0 into CSS, JSON and JS/TS. Components use only `var(--kalaa-*)`, enforced by `scripts/css.mjs --check`.                                                                                                                | `packages/tokens/src/*.json`, `build.mjs`                      | No Tailwind output: do not claim one.                                                    |
| 4   | Runtime switching with plain attributes: `data-accent`, `data-theme` (omit = follow system), now `data-shape`.                                                                                                                                                     | `packages/tokens/dist/tokens.css`                              | Nested scoping added with the shape work.                                                |
| 5   | Devanagari in the sans stack: IBM Plex Sans + IBM Plex Sans Devanagari.                                                                                                                                                                                            | `foundation.json`, `dist/fonts.css`                            | Fonts load via Google Fonts `@import`; self-host before hosting (change 14).             |
| 6   | Reduced motion: duration tokens drop to 0.                                                                                                                                                                                                                         | `tokens.css`, `docs/components-v0.1.md`                        |                                                                                          |
| 7   | Quality gate: axe (WCAG 2.0/2.1/2.2 AA) on every story in light and dark plus a screenshot baseline per story and theme; Storybook a11y `test: "error"`.                                                                                                           | `tests/stories.spec.ts`, `tests/__screenshots__`               | Generate counts at build time; never hardcode "0 violations".                            |
| 8   | Base UI 1.9.0 headless + plain CSS, `kl-` classes, no runtime styling, React 19 ref-as-prop.                                                                                                                                                                       | `packages/react/package.json`                                  |                                                                                          |
| 9   | Opinionated copy: sentence case, no ALL-CAPS; `StatusBadge` maps status words to tones in one table.                                                                                                                                                               | `docs/foundations-draft.md`, `docs/components-v0.1.md`         |                                                                                          |
| 10  | Vendored release tarballs (Docker builds need no registry).                                                                                                                                                                                                        | `docs/PLAN.md` D8                                              | Decision only, no pack/release script yet. Present as "distribution model"; no download. |
| 11  | Square identity: 0 radius by default, `data-shape="soft"` opt-in.                                                                                                                                                                                                  | `foundation.json`, component CSS                               | New 2026-11-20.                                                                          |

Do not claim: public npm package, Tailwind theme, Table (v0.2), density setting (v0.3).

Square notes: radius sm/md/lg = 0; `radius-full` 999px only for true circles (Button spinner). Checkbox, Switch
thumb/track and ProgressBar are square. With 0 radius the Banner 3px start border and Tabs selected state carry the
identity; keep 1px `--kalaa-border` borders crisp and rely on them more than shadow (consider dropping `shadow-1` on
Card).

## 2. Logo

### Primary: "Kalā square"

A square is the moon disc; the lit part is an L-shaped crescent (rectilinear waning crescent); the frame is the unlit
disc. Reads as moon phase and as a corner bracket, no radii, legible at 16px.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" role="img" aria-label="Kalaa">
  <path fill="var(--kalaa-text)" fill-rule="evenodd" d="M2 2H30V30H2Z M4 4V28H28V4Z"/>
  <path fill="var(--kalaa-accent)" d="M6 6H14V18H26V26H6Z"/>
</svg>
```

- Frame ring 2 units (even-odd), L arms 8 units, 2-unit gap to the frame. Fills only, no strokes.
- At 16px: ring 1px, gap 1px, arms 4px, all on whole pixels.
- Inline colours: frame `--kalaa-text`, L `--kalaa-accent` (follows accent and theme).
- Static files: light frame `#1B1F33`, L `#9A3E21` (Geru 700); dark frame `#E6E7EF`, L `#EE9473` (Geru 400);
  `favicon.svg` swaps via embedded `@media (prefers-color-scheme: dark)`. Check >= 3:1 with the
  `check-contrast.mjs` luminance function; never tweak anchors to pass.
- Clear space 8 units; minimum 16px mark, 96px wide lockup. Mono variant: both paths `currentColor`.

### Wordmark / lockup

Mark (height H), gap H/4, "Kalaa" in IBM Plex Serif 500, sentence case, letter-spacing -0.01em, ~0.75H. Text
baseline on the bottom edge of the L; check optical alignment visually. Header H = 28px. Optional "कला" in IBM Plex
Sans Devanagari 400 on brand page and footer only. Static wordmark SVG: text outlined from Plex Serif 500.
Don't: rotate, gradient, round variant, mark inside a circle. Soft shape does not change the logo.

### Alternative: "Half" (first-quarter moon)

```svg
<svg viewBox="0 0 32 32"><path fill-rule="evenodd" d="M2 2H30V30H2Z M4 4V28H28V4Z"/><path d="M6 6H16V26H6Z"/></svg>
```

Bolder at 16px but reads like a generic split-pane icon. Use only if the L fails at 16px on a real tab strip.

### Motif: phases strip

Four 6-unit squares, 2-unit gaps: frame only, L, half, full. Divider, step loader (not a spinner), 404. Not a favicon.

### Deliverables

`logo-mark.svg`, `logo-mono.svg`, `logo-wordmark.svg` (+ `logo-wordmark-dark.svg` for Storybook dark manager),
`favicon.svg`, `favicon.ico` (16/32), `apple-touch-icon.png` (180px), and a `Logo` React component.

## 3. Home page: `apps/site`

Static, Vite multi-page, prerendered with `react-dom/server` (readable without JS), built only from Kalaa
components plus site-local layout CSS (`apps/site/site.css`, tokens only).

### Sitemap

1. `/` Home. 2. `/getting-started.html` install, use, switch accent/theme/shape. 3. `/brand.html` logo downloads and
   rules, accents, shape rules, voice. 404 uses `EmptyState`. Storybook stays the component reference, linked from the
   site. Hosting layout (site at `/`, Storybook at `/storybook/` on remote host) changes a running service: **needs approval**.

### Global header

Sticky, 56px, `--kalaa-surface`, 1px bottom border. Logo lockup -> `/`. Ghost `ButtonLink`s: Get started,
Components, Foundations (Storybook), Brand. Right: `Select`s Accent (Neel/Geru/Mayur), Theme (System/Light/Dark),
Shape (Square/Soft), persisted in `localStorage` (try/catch; invalid values ignored), applied by an inline head
script before paint. Below 720px: logo + "Menu" `Button` disclosure. Skip link first.

### Sections

1. **Hero** (max 1120px, two columns above 960px). `PageHeader variant="brand"`: "Square, calm, and built for
   work." / "Kalaa is a design system for operational software. Accessible React components and design tokens with
   sharp corners, Indian-pigment accents and IBM Plex type." Primary `ButtonLink` "Get started", secondary "Open
   Storybook". `KeyValue layout="grid"` facts generated at build time (components, accents/themes, contrast checks,
   axe result). Right: live product fragment (Card "Cold-pressed mustard oil 1 L" + `StatusBadge` needs review,
   Field+Input, warning Banner "1 field needs attention", Save changes / Preview). No gradient, no illustration.
2. **What makes Kalaa different**: six Cards (auto-fit minmax(260px,1fr)): Square by default; Three pigment accents;
   Contrast is a build gate; Devanagari and numbers; Tokens first; Tested in both themes. Each with a ghost link.
3. **Sharp by design**: same small form (Field, Input, Select, Checkbox, Switch, Buttons) in two Cards, one default,
   one `data-shape="soft"`. Caption "Same components, one attribute."
4. **Three pigments**: one Card per accent (`data-accent` wrapper): "Neel · indigo" (default for apps), "Geru · red
   ochre" (brand colour), "Mayur · peacock teal" (calm alternative); role swatches with contrast ratios in KeyValue,
   primary Button, StatusBadge.
5. **Made for catalog and ops work**: KeyValue of product rows mixing Latin and Devanagari ("सरसों का तेल 1 लीटर",
   "₹ 245", "1,234 units"), tabular figures. No fake table.
6. **Get started**: underline Tabs Install / Use / Switch with `CodeBlock`s. Install marked "v0.1 preview"
   (tarball flow not built). Info Banner: "Kalaa is private for now. Packages are vendored as tarballs and are not on
   npm yet."
7. **Footer**: lockup, "Kalā: art and craft in Hindi, a phase of the moon in Sanskrit.", links, generated version and
   build date.

### New components (only these two)

1. `Logo` (`variant: "mark" | "lockup"`, `size`, optional `title`), inline SVG with role tokens.
2. `CodeBlock`: `<pre><code>` mono, surface-alt, 1px border, horizontal scroll, ghost sm "Copy" Button with
   `aria-live="polite"` status; on clipboard failure say "Select the text and copy it".

### Responsive, dark mode, states

Breakpoints 720px (nav collapses) and 960px (hero columns). Padding space-8 / space-4 under 720px; sections
space-12. Hero title 2xl -> xl under 720px. Mobile header controls 44px. Default theme follows system. Cover: JS off
(prerendered; switches hidden, `<noscript>` note), font failure (self-host), clipboard failure, bad stored
preference, reduced motion, 404. Same axe run as Storybook for site pages: light/dark, three accents, square/soft.

## 4. Storybook recalibration

Audit: three roots only (Components flat 19, Foundations 4 one-story pages, Overview with one example); no
introduction, no `storySort`, no autodocs although addon-docs is installed; toolbar has theme + accent only, no
icons; manager UI is default Storybook look; contrast pairs duplicated; `.example` in `foundations.css` maybe unused.

1. `stories/Introduction.mdx` first in the sidebar. Move `Overview/Product editor` to `Examples/Product editor`.
2. `storySort`: Introduction, Foundations (Logo, Colour, Typography, Shape, Space, Palette), Components (Layout:
   AppShell, PageHeader, Card, KeyValue, EmptyState; Actions: Button, ButtonLink; Forms: Field, Input, Textarea,
   Select, Checkbox, Switch; Navigation: Tabs; Feedback: Banner, Badge, StatusBadge, ProgressBar; Overlays: Dialog),
   Examples. Story ids change -> regenerate all baselines once and review.
3. Shape toolbar global (done in the shape lane); add toolbar icons to theme/accent/shape.
4. Tests: keep full matrix (square, neel, light+dark) plus a smoke subset (Button, Card, Field, Dialog, Product
   editor) for `shape:soft` and `accent:geru|mayur`.
5. `.storybook/kalaa-theme.ts`: `kalaaLight`/`kalaaDark` via `create()`, colours from the ramps (no new hex),
   Plex fonts, `appBorderRadius: 0`, `inputBorderRadius: 0`, brandTitle "Kalaa", brandImage wordmark.
6. `.storybook/manager.ts`: `addons.setConfig({ theme })` following `prefers-color-scheme`, `showRoots: true`.
7. `staticDirs` with logo + favicon; `manager-head.html` favicon link; dark wordmark asset.
8. `parameters.docs.theme` = Kalaa theme.
9. Autodocs (`tags: ["autodocs"]`, `docs.toc`), one-line JSDoc per prop, short Usage + Do/Don't per component from
   `docs/components-v0.1.md`.
10. New Foundations pages: Logo, Shape; Colour gets an "Accents" side-by-side story.
11. Export contrast pairs once from `@kalaa/tokens`; use in `check-contrast.mjs` and `Colour.stories.tsx`.
12. Typography: Devanagari at three sizes, weights 400/500/600, tabular figures, line-height note.
13. Space: missing tokens, control heights, Motion section.
14. Self-host Plex fonts (WOFF2, SIL OFL; verify package versions + licence first) incl. Devanagari, before hosting.
15. Clean `foundations.css` (unused rules, square cards).
16. Deploy layout change (site `/`, Storybook `/storybook/`): **needs approval**.
17. Docs: README status, `docs/tokens.md`, `docs/foundations-draft.md` radius row, PLAN decision record.

## 5. Open questions for Shashank (defaults in use until answered)

1. Logo/favicon brand colour Geru, site UI default Neel? **Default: yes (Geru logo assets, Neel site UI).**
2. Self-hosted fonts and moving Storybook to `/storybook/` on remote host? **Default: build both locally; no deploy
   without OK.**
3. Is `soft` a long-term mode or only a migration aid? **Default: long-term supported mode.**

## 6. Status checklist (2026-11-20, built locally, not deployed)

Decisions applied: Geru logo and favicon with a Neel site UI; self-hosted Plex (SIL OFL, versions in `docs/tokens.md`); soft is a long-term mode.

- [x] 2 Logo: `Logo` component, `brand/assets` (mark, dark mark, mono, wordmark and dark wordmark, favicon svg and ico, apple-touch-icon, 512px mark), generator `brand/build.mjs` with a 3:1 contrast gate. Static files use Geru-neutral 900 and 100 for the frame (warm, matching Geru surfaces) instead of the spec's Neel-neutral hex values; both are ramp values.
- [x] 2 `CodeBlock` component (and Card `titleLevel`, a small addition for correct heading order).
- [x] 3 `apps/site`: Home (7 sections), getting-started, brand, 404; Vite multi-page, prerendered; configurable `SITE_BASE` and `SITE_STORYBOOK_URL`; axe over pages x light/dark x 3 accents x square/soft.
- [x] 4.1-4.2 Introduction first, `storySort`, Examples/Product editor. 4.3 toolbar icons. 4.4 smoke subset (soft, geru, mayur). 4.5-4.8 Kalaa manager theme, manager config, static dirs, docs theme. 4.9 autodocs, prop JSDoc, usage and do/don't, controls for every component. 4.10 Logo and Shape pages, Accents story. 4.11 contrast pairs exported once. 4.12 Typography. 4.13 Space and Motion. 4.14 self-hosted fonts. 4.15 foundations.css reviewed (nothing unused; added page helpers). 4.17 docs.
- [ ] 4.16 Hosting layout (site at `/`, Storybook at `/storybook/` on remote host): needs approval, proposed diff is in the hand-off report.
- Deviation: the header collapses to the Menu button at 960px, not 720px, because logo, four links and three selects do not fit between 720 and 960px. Padding and hero title changes stay at 720px.
