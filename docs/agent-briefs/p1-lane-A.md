# P1 brief, lane A (codex, frontend-engineer role)

Build Kalaa v0.1 components. Read docs/components-v0.1.md (spec + conventions), docs/foundations-draft.md and
docs/tokens.md first; look at packages/tokens/dist/tokens.css for the exact token names.
Lane A: layout and display (Button, ButtonLink, Badge, StatusBadge, Banner, Card, PageHeader, KeyValue, EmptyState, ProgressBar, AppShell). Your barrel is packages/react/src/layout.ts.
Another engineer builds src/forms.ts and the lane B components (Field, Input, Textarea, Select, Checkbox, Switch, Tabs, Dialog) in parallel in the same repo: do not edit their files, src/index.ts, src/util.ts,
the build config, Storybook config, playwright config or tests/. If the type check shows errors only in their files,
ignore them and mention it.
Environment: run `. bin/env.sh` before any node/pnpm command. All dependencies are installed and you have no network:
do not install anything. Do not git commit. Read commands (cat, rg, ls, sed) are fine.

Verify (your components must pass):
`. bin/env.sh && pnpm --filter @kalaa/react exec tsc --noEmit && node packages/react/scripts/css.mjs --check && pnpm --filter @kalaa/react test && pnpm build-storybook`
(`pnpm test:stories` needs a browser and may not run in your sandbox; the main session runs it.)
Report: components done, test counts, anything from the spec you changed or skipped and why.
