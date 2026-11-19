import { Input } from "./Input";
const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Single-line text input (native props plus `size` and `invalid`). Put it in a `Field` to get a label and error text.\n\n**Do:** always give it an accessible name. **Don\'t:** make it bold; form controls stay at weight 400.\n\n**Usage**\n\n```tsx\nimport { Input } from "@kalaa/react";\n\n<Input aria-label="Product name" placeholder="Enter product name" />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { size: "md", invalid: false, disabled: false },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    value: { control: false },
    type: { control: "select", options: ["text", "email", "number", "search", "tel", "url"] },
    name: { control: "text" },
    "aria-label": { control: "text" },
    onChange: { action: "changed" },
    className: { control: false },
    ref: { control: false },
  },
};
export default meta;
export const Default = { args: { "aria-label": "Product name" } };
export const Small = { render: () => <Input aria-label="Product name" size="sm" /> };
export const Placeholder = {
  render: () => <Input aria-label="Product name" placeholder="Enter product name" />,
};
export const Disabled = {
  render: () => <Input aria-label="Product name" disabled defaultValue="Archived product" />,
};
export const Invalid = { render: () => <Input aria-label="Product name" invalid /> };
export const LongValue = {
  render: () => (
    <Input
      aria-label="Product name"
      defaultValue="Handwoven cotton cushion cover in natural indigo with a geometric pattern"
    />
  ),
};
