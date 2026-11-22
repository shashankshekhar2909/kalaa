# @kalaa/react

## 0.3.0

### Minor Changes

- e97cc3c: Add shared appearance options (theme, accent colour, corner shape) for plain-HTML and React apps:

  - `@kalaa/tokens`: export `@kalaa/tokens/theme.js` (`KalaaTheme` helper with `"kalaa.theme"` `localStorage` persistence and cross-tab `storage` sync), `@kalaa/tokens/theme-picker.js` (`<kalaa-theme-picker>` Shadow DOM custom element), `@kalaa/tokens/appearance-script` pre-paint inline script, and ESM helpers `KalaaTheme`, `readAppearance`, `applyAppearance`, `appearanceOptions`, and `accentSwatches` derived from real token palette values.
  - `@kalaa/react`: add `AppearanceMenu` component (`Popover` + `RadioGroup` with `Theme`, `Accent colour`, and `Corners` groups and palette swatch dots) and `useAppearance()` hook.

- f76e666: Initial release candidate 0.3.0 prepared for public npm publishing:

  - Relicensed under Apache-2.0 with copyright 2026 Shashank Shekhar.
  - Added public repository metadata, provenance configuration, issue tracker, and package keywords.
  - Cleaned declaration emits to exclude story and test definitions from distributed packages.
  - Configured source maps without embedded sourcesContent to reduce package payload size.
  - Constrained Toast generic type parameter `Data extends object` to ensure clean compilation under `skipLibCheck: false`.
  - Added GitHub Actions workflows for continuous integration and trusted npm publishing via OIDC.
  - Updated CI and release workflows to Node 24 and kept the React version label in sync with package metadata.
