---
"@kalaa/tokens": minor
"@kalaa/react": minor
---

Add shared appearance options (theme, accent colour, corner shape) for plain-HTML and React apps:

- `@kalaa/tokens`: export `@kalaa/tokens/theme.js` (`KalaaTheme` helper with `"kalaa.theme"` `localStorage` persistence and cross-tab `storage` sync), `@kalaa/tokens/theme-picker.js` (`<kalaa-theme-picker>` Shadow DOM custom element), `@kalaa/tokens/appearance-script` pre-paint inline script, and ESM helpers `KalaaTheme`, `readAppearance`, `applyAppearance`, `appearanceOptions`, and `accentSwatches` derived from real token palette values.
- `@kalaa/react`: add `AppearanceMenu` component (`Popover` + `RadioGroup` with `Theme`, `Accent colour`, and `Corners` groups and palette swatch dots) and `useAppearance()` hook.
