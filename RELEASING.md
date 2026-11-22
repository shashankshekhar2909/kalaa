# Releasing

## One-time setup

1. Use an npm account with 2FA and create the `kalaa` npm organization on the free public plan.
2. Build locally with `. bin/env.sh && pnpm install --frozen-lockfile && pnpm build`. Publish `@kalaa/tokens` first, then `@kalaa/react`, by running `npm publish --access public` in each package directory. Each package must exist on npm before adding its Trusted Publisher.
3. Add a Trusted Publisher to each package on npmjs.com, using repository `shashankshekhar2909/kalaa` and workflow `release.yml`. The first trusted publish must happen within 2 days of adding the publisher.
4. npm may default new publishers to staged publishing. Approve each staged release on npmjs.com.

## Normal release

Add a changeset and merge it to `master`. Changesets opens a “Version Packages” PR; merge it and `release.yml` publishes the packages. The Version PR runs `pnpm version-packages`, which also syncs `KALAA_VERSION` in `packages/react/src/util.ts`; `pnpm check` fails if they ever differ.

## Rollback

Deprecate a bad release with `npm deprecate` and publish a fix-forward patch. Never unpublish after 72 hours.
