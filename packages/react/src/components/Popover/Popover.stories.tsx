import { Button } from "../Button/Button";
import { Popover } from "./Popover";
export default {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Anchored non-modal overlay built on Base UI Popover for filter controls, quick inspectors or rich explanations.\n\n**Do:** use it for compact contextual controls tied to a trigger button. **Don\'t:** put long multi-step forms in a popover; use `Dialog`.\n\n**Usage**\n\n```tsx\nimport { Popover, Button } from "@kalaa/react";\n\n<Popover\n  trigger={<Button>Filter columns</Button>}\n  title="Column visibility"\n  description="Choose which fields appear in the table."\n>\n  <div>SKU, Title, Status</div>\n</Popover>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: {
    title: "Import batch details",
    description: "Uploaded 14 minutes ago from suppliers-q4.csv.",
    side: "bottom",
    align: "start",
    defaultOpen: true,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    side: { control: "inline-radio", options: ["top", "bottom", "left", "right"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    open: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    onOpenChange: { action: "open changed" },
    trigger: { control: false },
    children: { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {
  args: {
    trigger: <Button>Batch info</Button>,
    children: "128 rows parsed · 124 valid · 4 flagged for review.",
  },
};
