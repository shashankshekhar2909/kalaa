# @kalaa/react

Accessible React component library, design blocks, and page templates styled with Kalaa tokens on Base UI primitives.

- **Version**: 0.2.1
- **License**: Apache-2.0 (Copyright 2026 Shashank Shekhar)
- **Format**: ESM-only (`"type": "module"`). Node.js >= 20 and modern bundlers (Vite, Next.js, Storybook, etc.) supported.
- **Documentation**: [kalaa.buildwithshashank.com](https://kalaa.buildwithshashank.com)

## Installation

> **Not on npm yet.** `npm install @kalaa/react @kalaa/tokens` currently fails with `npm ERR! 404 Not Found`, because the packages have not been published to the npm registry. Install the tarballs from the [v0.3.2 GitHub Release](https://github.com/shashankshekhar2909/kalaa/releases/tag/v0.3.2) instead. Once Kalaa is on npm, a plain `npm install` will work and this note will go away.

### Install from the GitHub Release

```bash
dl=https://github.com/shashankshekhar2909/kalaa/releases/download/v0.3.2
mkdir -p vendor
for f in kalaa-tokens-0.3.1.tgz kalaa-react-0.3.2.tgz SHA256SUMS; do curl -fL --output-dir vendor -O "$dl/$f"; done
(cd vendor && sha256sum -c --ignore-missing SHA256SUMS)
npm install ./vendor/kalaa-tokens-0.3.1.tgz ./vendor/kalaa-react-0.3.2.tgz   # or: pnpm add ./vendor/kalaa-tokens-0.3.1.tgz ./vendor/kalaa-react-0.3.2.tgz
```

Maintainers build the tarballs with `scripts/release-pack.sh` (output in `release/`).

## CSS Order

Always import Kalaa stylesheets in this exact order at your application root:

```tsx
import "@kalaa/tokens/tokens.css"; // 1. DTCG design token custom properties
import "@kalaa/tokens/fonts.css"; // 2. Self-hosted IBM Plex font declarations
import "@kalaa/react/styles.css"; // 3. Component classes and layouts
```

## SSR & First-Paint Theme Guidance

To prevent flash of unstyled content (FOUC) or theme flicker during server-side rendering, set `data-theme`, `data-accent`, and `data-shape` directly on `<html>` at render time:

```html
<html data-theme="dark" data-accent="neel" data-shape="square"></html>
```

- `data-theme`: `"light"` | `"dark"` (omit to follow operating system preference via `prefers-color-scheme`).
- `data-accent`: `"neel"` (default indigo) | `"geru"` (red ochre) | `"mayur"` (peacock teal).
- `data-shape`: `"square"` (default sharp corners) | `"soft"` (rounded radius).

If preferences are stored in client storage (e.g. `localStorage`), set them via a blocking inline script inside `<head>` before body elements render:

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

## Usage

```tsx
import { Button, Card, Field, Input } from "@kalaa/react";

export function ProductEditor() {
  return (
    <Card title="Product details">
      <Field label="Product title" hint="Shown on storefront">
        <Input defaultValue="Cold-pressed mustard oil" />
      </Field>
      <Button variant="primary">Save changes</Button>
    </Card>
  );
}
```

## Appearance options

`AppearanceMenu` and `useAppearance()` let users switch **Theme** (`auto` / `light` / `dark`), **Accent colour** (`neel` / `geru` / `mayur` with palette swatch dots), and **Corners** (`square` / `soft`). Choices are stored in `localStorage` under `"kalaa.theme"`, applied to `<html>` (`data-theme`, `data-accent`, `data-shape`), and synced across tabs and plain-HTML apps.

### React

Inject `appearanceScript` from `@kalaa/tokens/appearance-script` in `<head>` to avoid first-paint flicker, then render `<AppearanceMenu />` or call `useAppearance()`:

```tsx
import { AppearanceMenu, useAppearance } from "@kalaa/react";
import { appearanceScript } from "@kalaa/tokens/appearance-script";

export function AppHeader() {
  const { theme, accent, shape, setAppearance } = useAppearance();
  return (
    <header>
      <script dangerouslySetInnerHTML={{ __html: appearanceScript }} />
      <span>{`${theme} · ${accent} · ${shape}`}</span>
      <AppearanceMenu />
    </header>
  );
}
```

### Plain HTML

Non-React tools can share the exact same appearance preferences by loading `@kalaa/tokens/theme.js` in `<head>` and mounting `<kalaa-theme-picker>` from `@kalaa/tokens/theme-picker.js`:

```html
<head>
  <link rel="stylesheet" href="/vendor/kalaa/tokens.css" />
  <link rel="stylesheet" href="/vendor/kalaa/fonts.css" />
  <script src="/vendor/kalaa/theme.js"></script>
  <script src="/vendor/kalaa/theme-picker.js" defer></script>
</head>
<body>
  <kalaa-theme-picker label="Appearance"></kalaa-theme-picker>
</body>
```

## License

Apache-2.0 (Copyright 2026 Shashank Shekhar).
