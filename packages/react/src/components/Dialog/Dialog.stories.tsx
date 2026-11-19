import { Dialog } from "./Dialog";
import { Button } from "../Button/Button";
const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Modal dialog on Base UI with focus trap, Escape to close and a labelled close button. Sizes sm, md and lg (400, 560, 720px).\n\n**Do:** use it for a focused decision or a short form. **Don\'t:** open a dialog from another dialog.\n\n**Usage**\n\n```tsx\nimport { Dialog, Button } from "@kalaa/react";\n\n<Dialog\n  trigger={<Button>Review import</Button>}\n  title="Review import"\n  footer={<Button variant="primary">Confirm</Button>}\n>\n  Twelve products are ready to import.\n</Dialog>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { size: "md" },
  argTypes: {
    open: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    onOpenChange: { action: "open changed" },
    trigger: { control: false },
    title: { control: "text" },
    description: { control: "text" },
    footer: { control: false },
    children: { control: "text" },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    className: { control: false },
  },
};
export default meta;
const base = {
  defaultOpen: true,
  trigger: <Button>Review import</Button>,
  title: "Review import",
  description: "Check the products before importing.",
  footer: (
    <>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </>
  ),
  children: "Twelve products are ready to import into the catalog.",
};
export const Default = { args: base };
export const Small = { args: { ...base, size: "sm" } };
export const Large = { args: { ...base, size: "lg" } };
