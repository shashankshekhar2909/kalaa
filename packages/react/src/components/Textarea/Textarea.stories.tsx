import { Textarea } from "./Textarea";
const meta = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Multi-line text input with the same look as Input; `autoResize` grows it with its content.\n\n**Do:** use it for descriptions and notes. **Don\'t:** use it for short values.\n\n**Usage**\n\n```tsx\nimport { Textarea } from "@kalaa/react";\n\n<Textarea aria-label="Product description" autoResize />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { size: "md", invalid: false, disabled: false, autoResize: false },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    autoResize: { control: "boolean" },
    rows: { control: "number" },
    placeholder: { control: "text" },
    defaultValue: { control: "text" },
    value: { control: false },
    name: { control: "text" },
    "aria-label": { control: "text" },
    onChange: { action: "changed" },
    className: { control: false },
    ref: { control: false },
  },
};
export default meta;
export const Default = { args: { "aria-label": "Product description" } };
export const Small = { render: () => <Textarea aria-label="Product description" size="sm" /> };
export const Placeholder = {
  render: () => <Textarea aria-label="Product description" placeholder="Enter product description" />,
};
export const Disabled = {
  render: () => <Textarea aria-label="Product description" disabled defaultValue="Archived product" />,
};
export const Invalid = { render: () => <Textarea aria-label="Product description" invalid /> };
export const LongValue = {
  render: () => (
    <Textarea
      aria-label="Product description"
      defaultValue="Handwoven cotton cushion cover in natural indigo. Each piece is finished by hand and may vary slightly."
    />
  ),
};
export const AutoResize = {
  render: () => (
    <Textarea aria-label="Product description" autoResize defaultValue="A handwoven cushion cover." />
  ),
};
