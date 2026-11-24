# @kalaa/tokens

Design tokens, color roles, switchable themes, and self-hosted IBM Plex typography for the Kalaa design system.

- **Version**: 0.2.1
- **License**: Apache-2.0 (Copyright 2026 Shashank Shekhar)
- **Format**: ESM-only (`"type": "module"`). Node.js >= 20.
- **Documentation**: [kalaa.buildwithshashank.com](https://kalaa.buildwithshashank.com)

## Installation

> **Not on npm yet.** `npm install @kalaa/react @kalaa/tokens` currently fails with `npm ERR! 404 Not Found`, because the packages have not been published to the npm registry. Install the tarballs from the [v0.3.2 GitHub Release](https://github.com/shashankshekhar2909/kalaa/releases/tag/v0.3.2) instead. Once Kalaa is on npm, a plain `npm install` will work and this note will go away.

### Install from the GitHub Release

```bash
dl=https://github.com/shashankshekhar2909/kalaa/releases/download/v0.3.2
mkdir -p vendor
for f in kalaa-tokens-0.3.1.tgz SHA256SUMS; do curl -fL --output-dir vendor -O "$dl/$f"; done
(cd vendor && sha256sum -c --ignore-missing SHA256SUMS)
npm install ./vendor/kalaa-tokens-0.3.1.tgz   # or: pnpm add ./vendor/kalaa-tokens-0.3.1.tgz
```

Maintainers build the tarballs with `scripts/release-pack.sh` (output in `release/`).

## CSS Order

Always load tokens before font declarations or component styles:

```tsx
import "@kalaa/tokens/tokens.css"; // 1. DTCG design token custom properties
import "@kalaa/tokens/fonts.css"; // 2. Self-hosted IBM Plex fonts
```

## Accents, Themes & Shapes

Tokens are applied via plain HTML data attributes:

- **Accents**: `neel` (default indigo), `geru` (red ochre), `mayur` (peacock teal).
- **Themes**: `light`, `dark` (omit attribute to follow operating system preference).
- **Shapes**: `square` (default, radius 0), `soft` (`data-shape="soft"`).

```html
<html data-accent="geru" data-theme="dark" data-shape="soft"></html>
```

The same attributes work on any wrapper element to re-theme subtrees:

```html
<div data-accent="geru" data-theme="dark">...</div>
```

## SSR & First-Paint Theme Guidance

Render `data-theme`, `data-accent`, and `data-shape` directly on the `<html>` element on the server, or place a synchronous script in `<head>` to read preferences before the initial render.

## Appearance options

`@kalaa/tokens` ships a framework-free helper (`@kalaa/tokens/theme.js`), a Shadow DOM custom element (`@kalaa/tokens/theme-picker.js`), a pre-paint inline script (`@kalaa/tokens/appearance-script`), and ESM helpers so every Kalaa app shares the same `"kalaa.theme"` `localStorage` key and `<html>` attributes (`data-theme`, `data-accent`, `data-shape`).

- **Theme**: `"auto"` (removes `data-theme` to follow the OS) | `"light"` | `"dark"`
- **Accent colour**: `"neel"` | `"geru"` | `"mayur"`
- **Corners**: `"square"` | `"soft"`

### Plain HTML

Load `theme.js` synchronously in `<head>` so the first paint has the saved colours, and use `<kalaa-theme-picker>` anywhere in your header or toolbar:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta name="color-scheme" content="dark light" />
    <link rel="stylesheet" href="/vendor/kalaa/tokens.css" />
    <link rel="stylesheet" href="/vendor/kalaa/fonts.css" />
    <script src="/vendor/kalaa/theme.js"></script>
    <script src="/vendor/kalaa/theme-picker.js" defer></script>
  </head>
  <body>
    <kalaa-theme-picker label="Appearance"></kalaa-theme-picker>
    <script>
      // Programmatic access:
      console.log(KalaaTheme.get()); // { theme: "auto", accent: "neel", shape: "square" }
      KalaaTheme.set({ theme: "dark", accent: "geru", shape: "soft" });
      KalaaTheme.onChange(function (next) {
        console.log("Appearance changed:", next);
      });
    </script>
  </body>
</html>
```

### React & Bundlers

For bundled apps and server components, import `appearanceScript` for zero-flicker first paint and use `KalaaTheme`, `readAppearance`, `applyAppearance` from `@kalaa/tokens` or `<AppearanceMenu />` and `useAppearance()` from `@kalaa/react`:

```tsx
import { appearanceScript } from "@kalaa/tokens/appearance-script";
import { KalaaTheme, applyAppearance, readAppearance } from "@kalaa/tokens";
import { AppearanceMenu } from "@kalaa/react";

export function RootHeader() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: appearanceScript }} />
      <AppearanceMenu />
    </>
  );
}
```

### App defaults

Set the app's own defaults on `<html>`; a viewer's saved choice still wins:

```html
<html data-default-theme="dark" data-default-accent="mayur" data-default-shape="soft"></html>
```

## Font Licensing

Bundled IBM Plex fonts (IBM Plex Sans, IBM Plex Serif, IBM Plex Mono, IBM Plex Sans Devanagari) are distributed under the SIL Open Font License 1.1. License texts are shipped in `./dist/fonts/`.

## License

Apache-2.0 (Copyright 2026 Shashank Shekhar).
