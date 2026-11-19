import { useState } from "react";
import { Tabs } from "./Tabs";
const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Switches between views of one subject. `segmented` for compact filters, `underline` for page sections.\n\n**Do:** keep labels short nouns. **Don\'t:** use tabs for steps in a flow.\n\n**Usage**\n\n```tsx\nimport { Tabs } from "@kalaa/react";\n\n<Tabs\n  variant="underline"\n  items={[\n    { value: "details", label: "Details", content: "Product details." },\n    { value: "history", label: "History", content: "3 earlier versions." },\n  ]}\n/>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { variant: "segmented" },
  argTypes: {
    items: { control: "object" },
    value: { control: false },
    defaultValue: { control: "select", options: ["products", "imports"] },
    onValueChange: { action: "tab changed" },
    variant: { control: "inline-radio", options: ["segmented", "underline"] },
    "aria-label": { control: "text" },
    className: { control: false },
  },
};
export default meta;
const items = [
  { value: "products", label: "Products", content: "Browse the product catalog." },
  { value: "imports", label: "Imports", content: "Review recent imports." },
  { value: "exports", label: "Exports", content: "Review exports.", disabled: true },
];
export const Segmented = { args: { "aria-label": "Catalog views", items } };
export const Underline = { args: { "aria-label": "Catalog views", items, variant: "underline" } };
function ControlledTabs() {
  const [value, setValue] = useState("products");
  return <Tabs aria-label="Catalog views" items={items} value={value} onValueChange={setValue} />;
}
export const Controlled = { render: () => <ControlledTabs /> };
