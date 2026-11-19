import type { ComponentProps } from "react";
import { Field } from "./Field";
import { Input } from "../Input/Input";
import { Textarea } from "../Textarea/Textarea";
import { Select } from "../Select/Select";

const meta = {
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Wraps one control with a label, optional hint, error and required marker, and wires `aria-describedby` and `aria-invalid`.\n\n**Do:** keep labels in sentence case without trailing colons. **Don\'t:** use placeholder text as the label.\n\n**Usage**\n\n```tsx\nimport { Field, Input } from "@kalaa/react";\n\n<Field label="Product title" hint="Shown on the storefront.">\n  <Input defaultValue="Cold-pressed mustard oil 1 L" />\n</Field>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { required: false },
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    required: { control: "boolean" },
    children: { control: false },
    className: { control: false },
  },
};
export default meta;
const options = [
  { value: "draft", label: "Draft" },
  { value: "approved", label: "Approved" },
];
export const WithHint = {
  args: { label: "Product name", hint: "Shown in the catalog." },
  render: (args: ComponentProps<typeof Field>) => (
    <Field {...args}>
      <Input />
    </Field>
  ),
};
export const WithError = {
  render: () => (
    <Field label="Product name" error="Enter a product name.">
      <Input />
    </Field>
  ),
};
export const Required = {
  render: () => (
    <Field label="Product name" required>
      <Input />
    </Field>
  ),
};
export const TextareaControl = {
  render: () => (
    <Field label="Product description" hint="Describe the product.">
      <Textarea />
    </Field>
  ),
};
export const SelectControl = {
  render: () => (
    <Field label="Review status" hint="Choose a status.">
      <Select options={options} />
    </Field>
  ),
};
