# Kalaa

Shashank's design system: one calm, professional look for every app. _Kalā_: art and craft in Hindi, a phase of the
moon in Sanskrit.

- `@kalaa/tokens`: design tokens (CSS custom properties, JSON, TypeScript), light and dark themes, self-hosted IBM Plex fonts.
- `@kalaa/react`: accessible React components on headless primitives, styled with Kalaa tokens.
- `apps/storybook`: component reference and foundations (Introduction, Logo, Colour, Shape, controls and docs per component).
- `apps/site`: static home site (Home, Get started, Brand, 404), prerendered, deploy-agnostic.
- `brand/`: logo and favicon sources (`node brand/build.mjs`).
- `apps/catalog-admin`: sample app built only with Kalaa (planned, P2).

Status: Version 0.2.1 (Apache-2.0 license, Copyright 2026 Shashank Shekhar).

## Installation

### Method A: Published npm packages (post-publish)

```bash
npm install @kalaa/react @kalaa/tokens
# or
pnpm add @kalaa/react @kalaa/tokens
```

### Method B: Vendored release tarballs (current / pre-publish)

Packages can be packaged as release tarballs using `scripts/release-pack.sh` and vendored:

```bash
# 1. Generate release tarballs
scripts/release-pack.sh

# 2. Add to your project
pnpm add ./vendor/kalaa-tokens-0.2.1.tgz ./vendor/kalaa-react-0.2.1.tgz
```

## CSS Order

Always load stylesheets in this exact order at your application root:

```tsx
import "@kalaa/tokens/tokens.css"; // 1. Tokens and custom properties
import "@kalaa/tokens/fonts.css"; // 2. Self-hosted IBM Plex fonts
import "@kalaa/react/styles.css"; // 3. Component styles
```

## SSR & First-Paint Theme Guidance

To avoid theme flicker (FOUC) on first paint, render `data-theme`, `data-accent`, and `data-shape` attributes directly on `<html>` server-side:

```html
<html data-accent="neel" data-theme="dark" data-shape="square"></html>
```

Or inject a synchronous inline script in `<head>` to read preferences from storage before HTML rendering:

```html
<head>
  <script>
    (function () {
      var theme = localStorage.getItem("kalaa-theme");
      var accent = localStorage.getItem("kalaa-accent");
      var shape = localStorage.getItem("kalaa-shape");
      var root = document.documentElement;
      if (theme) root.setAttribute("data-theme", theme);
      if (accent) root.setAttribute("data-accent", accent);
      if (shape) root.setAttribute("data-shape", shape);
    })();
  </script>
</head>
```

## Development Commands

Run `. bin/env.sh` first to set local paths.

- `pnpm build`: build tokens and react packages
- `pnpm check`: run TypeScript check and token / style validators
- `pnpm format:check`: verify formatting with Prettier
- `pnpm test`: run Vitest suite
- `pnpm build-storybook`: build static Storybook distribution
- `pnpm build:site`: build static showcase website
- `flock /tmp/kalaa-playwright.lock pnpm test:stories`: run visual regression & axe accessibility tests

## License

Apache-2.0 (Copyright 2026 Shashank Shekhar). Bundled fonts use SIL Open Font License 1.1.
