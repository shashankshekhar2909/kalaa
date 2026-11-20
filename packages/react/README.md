# @kalaa/react

Accessible React component library, design blocks, and page templates styled with Kalaa tokens on Base UI primitives.

- **Version**: 0.2.1
- **License**: Apache-2.0 (Copyright 2026 Shashank Shekhar)
- **Format**: ESM-only (`"type": "module"`). Node.js >= 20 and modern bundlers (Vite, Next.js, Storybook, etc.) supported.
- **Documentation**: [kalaa.buildwithshashank.com](https://kalaa.buildwithshashank.com)

## Installation

### Method A: Published npm package (post-publish)

```bash
npm install @kalaa/react @kalaa/tokens
# or
pnpm add @kalaa/react @kalaa/tokens
```

### Method B: Vendored release tarballs (current / pre-publish)

Generate tarballs using `scripts/release-pack.sh`, place them in your application's `vendor/` directory, and install:

```bash
pnpm add ./vendor/kalaa-tokens-0.2.1.tgz ./vendor/kalaa-react-0.2.1.tgz
```

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

## License

Apache-2.0 (Copyright 2026 Shashank Shekhar).
