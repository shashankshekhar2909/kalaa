# @kalaa/tokens

Design tokens, color roles, switchable themes, and self-hosted IBM Plex typography for the Kalaa design system.

- **Version**: 0.2.1
- **License**: Apache-2.0 (Copyright 2026 Shashank Shekhar)
- **Format**: ESM-only (`"type": "module"`). Node.js >= 20.
- **Documentation**: [kalaa.buildwithshashank.com](https://kalaa.buildwithshashank.com)

## Installation

### Method A: Published npm package (post-publish)

```bash
npm install @kalaa/tokens
# or
pnpm add @kalaa/tokens
```

### Method B: Vendored release tarballs (current / pre-publish)

Generate tarballs using `scripts/release-pack.sh`, copy to `vendor/`, and install:

```bash
pnpm add ./vendor/kalaa-tokens-0.2.1.tgz
```

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

## Font Licensing

Bundled IBM Plex fonts (IBM Plex Sans, IBM Plex Serif, IBM Plex Mono, IBM Plex Sans Devanagari) are distributed under the SIL Open Font License 1.1. License texts are shipped in `./dist/fonts/`.

## License

Apache-2.0 (Copyright 2026 Shashank Shekhar).
