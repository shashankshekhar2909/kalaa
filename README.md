# Kalaa

Shashank's design system: one calm, professional look for every app. _Kalā_: art and craft in Hindi, a phase of the
moon in Sanskrit.

- `@kalaa/tokens`: design tokens (CSS custom properties, JSON, TypeScript), light and dark themes.
- `@kalaa/react`: accessible React components on headless primitives, styled with Kalaa tokens.
- `apps/storybook`: component reference and foundations (Introduction, Logo, Colour, Shape, controls and docs per component).
- `apps/site`: static home site (Home, Get started, Brand, 404), prerendered, deploy-agnostic.
- `brand/`: logo and favicon sources (`node brand/build.mjs`).
- `apps/catalog-admin`: sample app built only with Kalaa (planned, P2).

Status: P0 and P1 done (19 components, square by default); site, logo and Storybook recalibration built locally (2026-11-20), not deployed.

Plan and decisions: [docs/PLAN.md](docs/PLAN.md). Private until a deliberate public release.

Common commands (run `. bin/env.sh` first): `pnpm build`, `pnpm build:site`, `pnpm build-storybook`, `pnpm test`, `pnpm test:stories` (Storybook and site, needs both builds), `pnpm format:check`.

Plan Plan and decisions: [docs/PLAN.md](docs/PLAN.md). Private until a deliberate public release.
