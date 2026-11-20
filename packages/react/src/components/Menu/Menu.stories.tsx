import { Button } from "../Button/Button";
import { Menu } from "./Menu";
export default {
  title: "Components/Menu",
  component: Menu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Action menu on Base UI Menu with full keyboard support (Arrow keys, Home/End, type-ahead, Enter/Space, Escape). Pass an `items` array or compose with `Menu.Item` and `Menu.Separator`.\n\n**Do:** place destructive items at the bottom after a `Menu.Separator` with `tone="danger"`. **Don\'t:** use `Menu` for form value selection; use `Select`.\n\n**Usage**\n\n```tsx\nimport { Menu, Button } from "@kalaa/react";\n\n<Menu\n  trigger={<Button>Row actions</Button>}\n  items={[\n    { label: "Duplicate record", onSelect: () => {} },\n    { type: "separator" },\n    { label: "Delete record", tone: "danger", onSelect: () => {} },\n  ]}\n/>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: {
    align: "start",
    defaultOpen: true,
    items: [
      { label: "Edit product" },
      { label: "Duplicate SKU" },
      { label: "Export JSON", disabled: true },
      { type: "separator" as const },
      { label: "Remove from catalog", tone: "danger" as const },
    ],
  },
  argTypes: {
    items: { control: "object" },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    open: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    onOpenChange: { action: "open changed" },
    trigger: { control: false },
    children: { control: false },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {
  args: {
    trigger: <Button>Row actions</Button>,
  },
};
