# Kalaa foundations draft (from Career Compass, 2026-11-19)

Calm, professional workspace (Linear / Grafana direction, owner preference): one accent colour, neutral surfaces,
sentence-case sans text, status colours only for status, generous but consistent spacing. No ALL-CAPS letter-spaced
labels, no decorative pills, no gradients or glows. Originally written for Career Compass: `apps/web/app/style.css` (tokens + base)
and `apps/web/components/ui.tsx` (components). Pages use the components; they do not invent new one-off styles.

## Tokens (CSS custom properties on :root, dark values under the existing dark selectors)

| Token                      | Light             | Dark              | Use                                         |
| -------------------------- | ----------------- | ----------------- | ------------------------------------------- |
| --bg                       | #f6f7f9           | #0f141b           | page background                             |
| --surface                  | #ffffff           | #161d27           | cards, sidebar, inputs                      |
| --surface-alt              | #f1f3f6           | #1d2632           | hover rows, table heads, tabs track         |
| --border                   | #e3e7ed           | #2a3441           | card and control borders, dividers          |
| --border-strong            | #cfd5de           | #3a4656           | control hover                               |
| --text                     | #18202b           | #e6ebf2           | body text, titles                           |
| --text-muted               | #5d6878           | #a3adbb           | secondary text, labels                      |
| --text-subtle              | #8590a0           | #7d8898           | timestamps, hints                           |
| --accent                   | #2f5bd3           | #7ea2ff           | primary buttons, links, focus, selected nav |
| --accent-hover             | #264bb0           | #9bb7ff           | primary hover                               |
| --accent-soft              | #eaf0fd           | #1e2b45           | selected nav background, info banner        |
| --on-accent                | #ffffff           | #0f141b           | text on primary                             |
| --success / --success-soft | #1f7a4d / #e7f5ee | #5cc58f / #15301f | done, approved, ok, offer                   |
| --warning / --warning-soft | #9a6200 / #fdf3e1 | #e8b44f / #33270f | slipped, unverified, needs review           |
| --danger / --danger-soft   | #b42318 / #fdecea | #f0857b / #3a1715 | failed, unsupported, rejected, delete       |

Type: `--font: Inter, system-ui, sans-serif`; numbers and IDs use `font-variant-numeric: tabular-nums` (no mono font).
Sizes: --fs-xs 12px, --fs-sm 13px, --fs-base 14px, --fs-md 16px, --fs-lg 20px, --fs-xl 26px.
Weights: 400 body and all form controls (inputs, textareas, selects are never bold), 500 labels and nav, 600 titles
and buttons. Line height 1.5 (1.25 for titles).
Space (4 px scale): --sp-1 4, --sp-2 8, --sp-3 12, --sp-4 16, --sp-5 20, --sp-6 24, --sp-8 32.
Radius (Kalaa, 2026-11-20): square by default, so sm/md/lg/pill are all 0; `data-shape="soft"` restores 6px (badges, small controls), 8px (controls), 12px (cards, dialogs) and 999px (pill). Career Compass originally used the soft values.
Shadow: --shadow-1 `0 1px 2px rgb(16 24 40 / 0.05)` on cards only. Focus: 2px solid var(--accent), offset 2px, on every
interactive element via :focus-visible.
Control height: 36px (md), 30px (sm).

## Layout

- Sidebar: full viewport height (sticky, `height: 100vh`), surface background, right border.
- Main: max-width 1120px, padding --sp-8 desktop / --sp-4 mobile.
- Vertical rhythm: page header, then a stack of cards with gap --sp-4. Grids (two columns) also use gap --sp-4.
  Cards never touch; nothing relies on margins of the previous element.
- Inside a card: padding --sp-5; header row (title left, actions right) then content with gap --sp-4 between groups.

## Components (components/ui.tsx)

- **PageHeader** `{title, description?, back?: {href, label}, actions?}`: optional small back link above, title
  (--fs-xl, 600), description (--text-muted), actions right-aligned on the title row. No eyebrow labels.
- **Card** `{title?, description?, actions?, children, className?}`: header row only when title is given; title --fs-md 600.
- **Button** `{variant: "primary"|"secondary"|"ghost"|"danger", size?: "md"|"sm", ...button props}`;
  **ButtonLink** same variants for `<a>`/Next Link. Rules: at most one primary per card or page header, and it is the
  main next step. Secondary = bordered surface. Ghost = text-only for low-emphasis inline actions (Cancel, Edit in rows).
  Danger = destructive (Delete). Disabled = 50% opacity, no hover change, `cursor: not-allowed`.
- **Badge** `{tone?: "neutral"|"info"|"success"|"warning"|"danger", children}`: --fs-xs, 500, --r-sm, soft background +
  matching text colour, sentence case. **StatusBadge** `{status}` maps status words to tones in one table:
  neutral: found, planned, draft, parked, carried · info: applied, interview, pending, sent ·
  success: done, approved, offer, ok, complete · warning: slipped, unverified · danger: rejected, failed, unsupported.
  Text shown is the status in sentence case ("Unsupported").
- **Field** `{label, hint?, error?, children}`: label --fs-sm 500 --text-muted above the control (sentence case), hint
  --fs-xs --text-subtle below, error --fs-xs --danger. Checkbox fields put the box left of a normal-weight label.
- **Banner** `{tone: "info"|"warning"|"danger"|"success", title?, children, actions?}`: soft background, 3px left border
  in the tone colour, --r-md. Used for blocking messages, errors and important notices (replaces ad-hoc `role=alert` text).
- **Tabs** `{items: [{key,label}], value, onChange}`: segmented control on --surface-alt track, selected = surface + shadow.
- **KeyValue** `{rows: [{label, value}]}`: two-column definition list with dividers (job Details).
- **EmptyState** `{children, action?}`: muted text, optional secondary button.
- Keep **ProgressBar**, **Dialog**, **formatDate**, **localDate** (restyle with tokens only).

## Copy rules

Sentence case for every label, heading and button ("Add a timeline note", "CVs", "Visible on share page").
Buttons are verbs ("Prepare application", "Approve", "Save changes"). No trailing colons in labels.
