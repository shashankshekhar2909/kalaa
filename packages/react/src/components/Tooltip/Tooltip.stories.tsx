import { Button } from "../Button/Button";
import { Tooltip } from "./Tooltip";
export default {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Brief non-interactive hint on Base UI Tooltip that appears on hover or keyboard focus and dismisses with Escape.\n\n**Do:** keep copy to a few words or a keyboard shortcut. **Don\'t:** put links, buttons or essential form instructions inside a tooltip; use `Popover` or `Field hint`.\n\n**Usage**\n\n```tsx\nimport { Tooltip, Button } from "@kalaa/react";\n\n<Tooltip content="Export filtered rows as UTF-8 CSV">\n  <Button>Export CSV</Button>\n</Tooltip>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: {
    content: "Export filtered rows as UTF-8 CSV",
    side: "bottom",
    defaultOpen: true,
  },
  argTypes: {
    content: { control: "text" },
    side: { control: "inline-radio", options: ["top", "bottom", "left", "right"] },
    delay: { control: "number" },
    open: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    onOpenChange: { action: "open changed" },
    children: { control: false },
    className: { control: false },
  },
};
export const Default = {
  render: (args: { content: string; side?: "top" | "bottom" | "left" | "right"; defaultOpen?: boolean }) => (
    <div style={{ padding: "var(--kalaa-space-6)" }}>
      <Tooltip {...args}>
        <Button>Export CSV</Button>
      </Tooltip>
    </div>
  ),
};
