import { Checkbox } from "./Checkbox";
const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Checkbox with a label and optional description, built on Base UI. Supports `indeterminate` for select all.\n\n**Do:** use it for independent yes/no choices. **Don\'t:** use it for an immediate on/off setting; use a Switch.\n\n**Usage**\n\n```tsx\nimport { Checkbox } from "@kalaa/react";\n\n<Checkbox label="Show on storefront" defaultChecked />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { disabled: false, indeterminate: false },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text" },
    onCheckedChange: { action: "checked changed" },
    className: { control: false },
    ref: { control: false },
  },
};
export default meta;
export const Unchecked = { args: { label: "Include archived products" } };
export const Checked = { render: () => <Checkbox label="Include archived products" defaultChecked /> };
export const Indeterminate = { render: () => <Checkbox label="Select all products" indeterminate /> };
export const WithDescription = {
  render: () => (
    <Checkbox label="Include archived products" description="Apply this setting to the catalog." />
  ),
};
export const DisabledUnchecked = { render: () => <Checkbox label="Include archived products" disabled /> };
export const DisabledChecked = {
  render: () => <Checkbox label="Include archived products" disabled defaultChecked />,
};
