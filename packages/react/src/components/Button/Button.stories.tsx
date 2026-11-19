import { Button } from "./Button";

export default {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Action button. `primary` is the main next step, `secondary` the default, `ghost` low-emphasis inline actions, `danger` destructive ones.\n\n**Do:** use at most one primary per card or page header, and verbs for labels ("Save changes"). **Don\'t:** write labels in ALL CAPS or disable a button without saying why.\n\n**Usage**\n\n```tsx\nimport { Button } from "@kalaa/react";\n\n<Button variant="primary">Save changes</Button>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { variant: "secondary", size: "md", loading: false, disabled: false },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
    type: { control: "select", options: ["button", "submit", "reset"] },
    iconStart: { control: false },
    iconEnd: { control: false },
    onClick: { action: "clicked" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Primary = { args: { variant: "primary", children: "Add product" } };
export const Secondary = { args: { children: "Review import" } };
export const Ghost = { args: { variant: "ghost", children: "Edit" } };
export const Danger = { args: { variant: "danger", children: "Delete product" } };
export const Small = { args: { size: "sm", children: "Save changes" } };
export const States = {
  render: () => (
    <>
      <Button disabled>Save changes</Button> <Button loading>Import products</Button>{" "}
      <Button>A long product action for review</Button>
    </>
  ),
};
