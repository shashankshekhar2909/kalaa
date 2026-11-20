import { Icon, iconNames } from "./Icon";
export default {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Curated 24-icon set for operational interfaces: inline 24×24 SVG strokes using `currentColor`. Decorative by default (`aria-hidden="true"`); pass `label` when the icon stands alone without text.\n\n**How to add an icon:** add a single entry to `iconPaths` in `packages/react/src/components/Icon/Icon.tsx` (path data on a `0 0 24 24` grid, 1.75 stroke, round caps and joins, no colour literals). Its key becomes part of `IconName` and `iconNames` automatically.\n\n**Do:** keep icons decorative beside text labels, and set `label` on icon-only controls. **Don\'t:** hard-code hex colours on icons; let them inherit `currentColor` from their parent.\n\n**Usage**\n\n```tsx\nimport { Icon, Button } from "@kalaa/react";\n\n<Button iconStart={<Icon name="upload" size="sm" />}>Import CSV</Button>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { name: "search", size: "md" },
  argTypes: {
    name: { control: "select", options: iconNames },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    label: { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {};
export const Gallery = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "var(--kalaa-space-3)",
        fontFamily: "var(--kalaa-font-sans)",
        fontSize: "var(--kalaa-font-size-sm)",
        color: "var(--kalaa-text)",
      }}
    >
      {iconNames.map((name) => (
        <div
          key={name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--kalaa-space-2)",
            padding: "var(--kalaa-space-2)",
            border: "1px solid var(--kalaa-border)",
            borderRadius: "var(--kalaa-radius-md)",
            background: "var(--kalaa-surface)",
          }}
        >
          <Icon name={name} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
