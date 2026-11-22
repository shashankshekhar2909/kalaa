---
"@kalaa/react": minor
"@kalaa/tokens": minor
---

Initial release candidate 0.3.0 prepared for public npm publishing:

- Relicensed under Apache-2.0 with copyright 2026 Shashank Shekhar.
- Added public repository metadata, provenance configuration, issue tracker, and package keywords.
- Cleaned declaration emits to exclude story and test definitions from distributed packages.
- Configured source maps without embedded sourcesContent to reduce package payload size.
- Constrained Toast generic type parameter `Data extends object` to ensure clean compilation under `skipLibCheck: false`.
- Added GitHub Actions workflows for continuous integration and trusted npm publishing via OIDC.
- Updated CI and release workflows to Node 24 and kept the React version label in sync with package metadata.
