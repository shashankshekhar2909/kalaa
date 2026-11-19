# P1 brief, lane B (codex, frontend-engineer role)

Build Kalaa v0.1 components. Read docs/components-v0.1.md (spec + conventions), docs/foundations-draft.md and
docs/tokens.md first; look at packages/tokens/dist/tokens.css for the exact token names.
Lane B: form and overlay (Field, Input, Textarea, Select, Checkbox, Switch, Tabs, Dialog). Your barrel is packages/react/src/forms.ts. You may import Button from "../Button/Button" only if it already exists; otherwise use a plain <button className="kl-dialog__close"> styled in your own CSS.
Another engineer builds src/layout.ts and the lane A components in parallel in the same repo: do not edit their files, src/index.ts, src/util.ts,
the build config, Storybook config, playwright config or tests/. If the type check shows errors only in their files,
ignore them and mention it.
Environment: run `. bin/env.sh` before any node/pnpm command. All dependencies are installed and you have no network:
do not install anything. Do not git commit. Read commands (cat, rg, ls, sed) are fine.

Verify (your components must pass):
`. bin/env.sh && pnpm --filter @kalaa/react exec tsc --noEmit && node packages/react/scripts/css.mjs --check && pnpm --filter @kalaa/react test && pnpm build-storybook`
(`pnpm test:stories` needs a browser and may not run in your sandbox; the main session runs it.)
Report: components done, test counts, anything from the spec you changed or skipped and why.
