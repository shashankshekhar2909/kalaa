import { Divider } from "./Divider";
export default {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          '1px rule in `--kalaa-border` with `role="separator"`. Supports horizontal rules (with an optional centred label) and vertical rules for toolbars.\n\n**Do:** use spacing before adding a divider; reserve dividers for distinct sections. **Don\'t:** stack dividers directly against Card borders.\n\n**Usage**\n\n```tsx\nimport { Divider } from "@kalaa/react";\n\n<Divider label="Import options" />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { orientation: "horizontal", decorative: false },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    label: { control: "text" },
    decorative: { control: "boolean" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {};
export const WithLabel = { args: { label: "Or map columns manually" } };
export const Vertical = {
  render: () => (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--kalaa-space-3)",
        fontFamily: "var(--kalaa-font-sans)",
        fontSize: "var(--kalaa-font-size-sm)",
        color: "var(--kalaa-text)",
      }}
    >
      <span>124 products</span>
      <Divider orientation="vertical" />
      <span>12 pending review</span>
    </div>
  ),
};
