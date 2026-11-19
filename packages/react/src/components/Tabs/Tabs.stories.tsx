import { useState } from "react";
import { Tabs } from "./Tabs";
const meta = { title: "Components/Tabs", component: Tabs };
export default meta;
const items = [
  { value: "products", label: "Products", content: "Browse the product catalog." },
  { value: "imports", label: "Imports", content: "Review recent imports." },
  { value: "exports", label: "Exports", content: "Review exports.", disabled: true },
];
export const Segmented = { render: () => <Tabs aria-label="Catalog views" items={items} /> };
export const Underline = {
  render: () => <Tabs aria-label="Catalog views" items={items} variant="underline" />,
};
function ControlledTabs() {
  const [value, setValue] = useState("products");
  return <Tabs aria-label="Catalog views" items={items} value={value} onValueChange={setValue} />;
}
export const Controlled = { render: () => <ControlledTabs /> };
