import { Select } from "./Select";
const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Dropdown built on Base UI Select, with keyboard support (arrows, type-ahead, Escape).\n\n**Do:** use it for four or more options. **Don\'t:** use it for two options; use a Switch or Checkbox.\n\n**Usage**\n\n```tsx\nimport { Select } from "@kalaa/react";\n\n<Select\n  aria-label="Review status"\n  options={[{ value: "draft", label: "Draft" }, { value: "review", label: "Needs review" }]}\n  defaultValue="draft"\n/>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { size: "md", invalid: false, disabled: false },
  argTypes: {
    options: { control: "object" },
    defaultValue: { control: "select", options: ["draft", "review", "long"] },
    value: { control: false },
    onValueChange: { action: "value changed" },
    placeholder: { control: "text" },
    size: { control: "inline-radio", options: ["sm", "md"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text" },
    "aria-label": { control: "text" },
    className: { control: false },
  },
};
export default meta;
const options = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "Needs review" },
  { value: "archived", label: "Archived", disabled: true },
  { value: "long", label: "Approved for publication in all catalog collections" },
];
export const Default = { args: { "aria-label": "Review status", options } };
export const Small = { render: () => <Select aria-label="Review status" options={options} size="sm" /> };
export const Placeholder = {
  render: () => <Select aria-label="Review status" options={options} placeholder="Choose a review status" />,
};
export const Disabled = { render: () => <Select aria-label="Review status" options={options} disabled /> };
export const Invalid = { render: () => <Select aria-label="Review status" options={options} invalid /> };
export const LongValue = {
  render: () => <Select aria-label="Review status" options={options} defaultValue="long" />,
};
export const PreselectedWithDisabledOption = {
  render: () => <Select aria-label="Review status" options={options} defaultValue="review" />,
};
