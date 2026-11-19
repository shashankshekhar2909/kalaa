# P1 lane B, finish (codex, frontend-engineer + qa-engineer roles)

Your earlier lane B run (Field, Input, Textarea, Select, Checkbox, Switch, Tabs, Dialog) left gaps you reported
yourself. Close them. Spec and conventions: docs/components-v0.1.md. Run `. bin/env.sh` before any node/pnpm command;
no network, no installs, no git commits. Do not change lane A components, tokens, build config or tests/ (Playwright).

1. Stories (CSF3, realistic catalog-admin copy, sentence case), per component:
   - Field: with hint, with error (invalid state on the control), required, wrapping each of Input, Textarea, Select.
   - Input / Textarea / Select: default, small size, placeholder, disabled, invalid, long value; Textarea autoResize;
     Select with a disabled option and a preselected value.
   - Checkbox / Switch: unchecked, checked, indeterminate (checkbox), with description, disabled checked and unchecked.
   - Tabs: segmented and underline, one disabled tab, controlled example.
   - Dialog: a story that renders it OPEN by default (so screenshots and axe see the popup) with title, description,
     body, and a footer with Cancel (secondary) + Confirm (primary, import `Button` from "../Button/Button"); plus sm and lg.
     Replace the placeholder "States" stories with these. Every control needs an accessible name.
2. Tests (Vitest + Testing Library): add Input.test.tsx, Textarea.test.tsx, Select.test.tsx; for every lane B component
   cover role + accessible name, keyboard behaviour (Space toggles checkbox/switch; arrows move between tabs; Escape
   closes dialog and focus returns to the trigger; Select opens with keyboard and picks an option), disabled state,
   `aria-invalid` + `aria-describedby` wiring from Field (hint and error ids), className and ref pass-through.
3. Keep code readable (multi-line JSX); run `pnpm format` at the end.

Verify: `. bin/env.sh && pnpm --filter @kalaa/react exec tsc --noEmit && node packages/react/scripts/css.mjs --check && pnpm --filter @kalaa/react test && pnpm format:check`
Report: stories added, test count, anything not done and why.
