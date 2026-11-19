# Kalaa: plan (v0, 2026-11-19)

**Kalaa** (Hindi _kalā_: art, craft; Sanskrit: a phase of the moon) is Shashank's own design system: one calm,
professional look for every app he builds, and a portfolio piece that shows design-systems and frontend-architecture
work end to end. Packages: `@kalaa/tokens`, `@kalaa/react`. Name check 2026-11-19: no npm package or scope named
kalaa, no GitHub design system with that name.

## Decisions (Shashank, 2026-11-19)

| #   | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Ships as a framework-neutral **tokens** package (CSS custom properties + JSON + TS) and a **React** component library                                                                                                                                                                                                                                                                                                                                                         |
| D2  | Components are built on **headless accessible primitives** with 100% own styling                                                                                                                                                                                                                                                                                                                                                                                              |
| D3  | **Private now, public later** (making the repo public, publishing to npm or a docs site needs a separate OK)                                                                                                                                                                                                                                                                                                                                                                  |
| D4  | Sample app = **mini catalog admin** that uses only Kalaa components                                                                                                                                                                                                                                                                                                                                                                                                           |
| D5  | Career Compass is the first real app to adopt it (its UI restyle waits for Kalaa v0.1)                                                                                                                                                                                                                                                                                                                                                                                        |
| D6  | Accent: **Neel** (indigo #2E3A8C, dark #9EA9F2) is the default for apps; **Geru** (red ochre #9A3E21) is the brand colour outside apps; Kalaa ships Neel, Geru and Mayur (peacock teal #0E676D) as switchable accent themes. Comparison: https://claude.ai/artifact/PaBdXZ8CbiQq2UmxeDhZkD                                                                                                                                                                                    |
| D7  | Type: **IBM Plex Sans** (UI, tabular figures by default), **IBM Plex Serif** (headings, brand), IBM Plex Mono (code), IBM Plex Sans Devanagari (Hindi); font roles are tokens so the family is swappable like the accent. Comparison: https://claude.ai/artifact/AY3MXDsX1BQeKUzFo5ynwc                                                                                                                                                                                       |
| D8  | Distribution: release tarballs vendored into each app (default; revisit at P5)                                                                                                                                                                                                                                                                                                                                                                                                |
| D9  | **Square by default** (Shashank, 2026-11-20): radius sm/md/lg/pill = 0; `data-shape="soft"` restores 6/8/12/999px as a swappable theme like accents. `radius-full` (999px) is only for true circles. Selectors also work on nested wrappers.                                                                                                                                                                                                                                  |
| D10 | **Home site and brand** (Shashank, 2026-11-20): `apps/site` is a static, Vite multi-page site prerendered with react-dom/server (reads without JS), built only from Kalaa components. Logo and favicon use Geru, the site UI defaults to Neel. Plex fonts are self-hosted (SIL OFL). `soft` shape is a long-term mode. Site serves at `/` and Storybook at a configurable base (default `/storybook/`); the hosting change needs approval. Spec: [site-spec.md](site-spec.md) |

## Visual direction

Calm ops-console / product-tool look (Linear, Grafana): neutral surfaces, one accent colour, sentence case, status
colours only for status, consistent 4 px spacing, light and dark themes from day one. No ALL-CAPS letter-spaced labels,
decorative pills, gradients or glows. Starting point: [foundations draft](foundations-draft.md) (tokens, layout,
component rules and copy rules written for Career Compass; becomes the v0.1 spec after review).

## Token architecture (makes colour decisions reversible)

1. **Palette** (primitives): 50-950 ramps for neel, geru, mayur, a neutral ramp per accent (slight hue bias), status
   ramps (green, amber, red, crimson). Never used directly by components.
2. **Roles** (semantic): `--kalaa-accent`, `-accent-hover`, `-accent-soft`, `-on-accent`, `-bg`, `-surface`,
   `-surface-alt`, `-border`, `-text`, `-text-muted`, `-success`, `-warning`, `-danger` (+ `-soft`). A theme = a
   mapping from roles to palette steps, for light and dark.
3. **Components**: reference roles only (no hex values in component CSS; a lint rule enforces it).
   Switching: the default accent is one mapping in `@kalaa/tokens`; an app or page can override with
   `<html data-accent="geru|mayur">` at runtime. Theme-specific fixes live in the theme (e.g. Geru maps danger to crimson
   and status badges always carry an icon). The build runs a WCAG check on every role pair for every theme in light and
   dark and fails below AA (4.5:1 text, 3:1 UI). Adding a colour = add a ramp + a mapping.

## Stack (versions checked on the npm registry 2026-11-19)

| Part                                                            | Choice                              | Version (last publish)                       | Why                                                                                                                                                          |
| --------------------------------------------------------------- | ----------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Headless primitives                                             | Base UI `@base-ui/react`            | 1.9.0 (2026-10-09)                           | Stable 1.x, React 17-19, unstyled, highest adoption today (~31M weekly downloads vs Radix ~30M, React Aria ~10M), calm release cadence (11 releases in 2026) |
| Alternative                                                     | React Aria Components               | 1.22.1 (2026-10-09)                          | Best-in-class a11y and touch handling; heavier API. Use for a component Base UI lacks (e.g. date picker)                                                     |
| Tokens                                                          | Style Dictionary, DTCG JSON source  | 5.8.0 (2026-11-03)                           | One source -> CSS variables (light/dark), TS constants, optional Tailwind v4 `@theme` file                                                                   |
| Library build                                                   | tsup                                | 9.0.0 (2026-10-14)                           | ESM + types, keeps `"use client"`; tsdown 0.23 is newer but still 0.x                                                                                        |
| Component styling                                               | Plain CSS with tokens + CSS Modules | n/a                                          | Zero runtime, works in apps with or without Tailwind                                                                                                         |
| Workbench + docs                                                | Storybook                           | 10.6.7 (2026-11-13)                          | Component states, a11y addon, docs pages; Ladle dropped (no release for a year)                                                                              |
| Tests                                                           | Playwright (+ axe for a11y), Vitest | 1.65.1 (2026-11-19)                          | Free visual regression (screenshots, both themes), keyboard and a11y checks                                                                                  |
| Monorepo                                                        | pnpm workspaces + Changesets        | pnpm 12.21.0, changesets 3.0.3               | Versioning and changelog; Turborepo (2.11) not worth it for 2 packages + 1 app                                                                               |
| Sample app                                                      | Next.js (App Router), React 19      | match Career Compass (Next 16.4, React 19.3) | Same runtime as the real consumers                                                                                                                           |
| Re-verify versions when a phase starts; record any change here. |

## Repo layout

```
kalaa/
  packages/tokens/     DTCG JSON source, Style Dictionary config -> dist/{tokens.css, tokens.json, index.ts, tailwind.css}
  packages/react/      components (one folder each: Component.tsx, Component.module.css, stories, tests)
  apps/catalog-admin/  sample app (Next.js), uses only @kalaa/*
  apps/storybook/      Storybook 10 workbench and docs
  docs/                PLAN.md, foundations, decisions (ADRs), case study draft
```

## Components

- **v0.1 (foundations):** tokens + themes, AppShell (sidebar, header, main), PageHeader, Card, Button / ButtonLink,
  Badge / StatusBadge, Banner, Field + Input, Textarea, Select, Checkbox, Switch, Tabs, KeyValue, EmptyState,
  ProgressBar, Dialog. Each with all states, light/dark, keyboard and screen-reader behaviour.
- **v0.2 (product patterns):** Table (sort, selection, sticky header, empty/loading), Pagination, Menu, Popover,
  Tooltip, Toast, Combobox, FileDrop, Skeleton, Breadcrumbs, Stepper.
- **v0.3 (polish):** density setting (comfortable/compact), print styles (CV/report pages), motion tokens with
  `prefers-reduced-motion`, chart colour tokens for data viz.

## Sample app: mini catalog admin (synthetic or open data only)

Screens: Overview (what needs attention, counts, recent imports), Products (Table with filters, bulk actions),
Product detail + edit form (validation, dirty state, save), CSV import (FileDrop -> column mapping Stepper -> review),
Review queue (approve/reject with Badge statuses and Banner errors), Settings (theme, density). Every screen has empty,
loading and error states. Data: a small open dataset with its licence and attribution (e.g. an Open Food Facts sample,
ODbL 1.0), no personal data.

## Phases (weekend-sized, ~2.5 h portfolio budget per weekend; agents do most of the build)

| Phase | Goal                                                         | Done when                                                                                                                    |
| ----- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| P0    | Repo, pnpm workspace, tokens pipeline, Storybook, CI scripts | `pnpm build` makes tokens.css (light/dark) + an empty react package; Storybook runs; versions recorded                       |
| P1    | v0.1 components                                              | All v0.1 components in Storybook with states; axe has 0 violations; keyboard tests pass; screenshot baselines in both themes |
| P2    | Catalog admin sample app                                     | All screens built only from Kalaa; Playwright e2e for import and review flows; screenshots light/dark, desktop/mobile        |
| P3    | Adopt in Career Compass                                      | Career Compass uses `@kalaa/react`; its local style.css shrinks to layout glue; before/after screenshots                     |
| P4    | v0.2 components + second app (BuildOS Audio or Lumora)       | Table and overlays shipped; second app migrated                                                                              |
| P5    | Go public (needs OK)                                         | Scrub check, public repo, Storybook docs site, case study on buildwithshashank.com                                           |

## Distribution (decide in P0)

Recommended start: release tarballs (`pnpm pack`) attached to git tags and vendored into each app
(`vendor/kalaa-react-x.y.z.tgz`). Works inside Docker builds with no tokens or registry, and consumers pin exact
versions. Move to the public npm `@kalaa` scope at P5. Alternatives: GitHub Packages (free private quota, but every
consumer and Docker build needs a token) or self-hosted Verdaccio on deploy-server (a new service to run; needs approval).

## Quality bar

- Accessibility: WCAG 2.2 AA contrast for all token pairs (checked by a script on the token JSON), visible focus,
  full keyboard use, axe clean in Storybook and the sample app.
- Visual regression: Playwright screenshots of every story in light and dark; diffs reviewed before release.
- API: typed props, no `any`, forwardRef where needed, `className` escape hatch, no global CSS except tokens/reset.
- Each release: Changeset entry, changelog, version tag, release tarball.

## How we build (per portfolio CONTEXT.md)

Main Claude session plans, writes briefs and verifies. Ideation and design critique: `ai delegate --kind ideate`
(agy, product-designer role). Code: codex (`--kind code`), frontend-engineer role, in lanes (tokens, components,
sample app). Review: `--kind review` (codex read-only) + screenshot checks. Briefs in `docs/agent-briefs/`.

## Open decisions for Shashank

None before P0.
