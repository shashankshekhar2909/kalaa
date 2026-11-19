import { Tabs } from "./Tabs";

const meta = { title: "Components/Tabs", component: Tabs };
export default meta;
export const Default = {
  render: () => (
    <Tabs
      aria-label="Catalog views"
      items={[
        { value: "products", label: "Products", content: "Product catalog" },
        { value: "imports", label: "Imports", content: "Import history" },
      ]}
    />
  ),
};
export const States = {
  render: () => (
    <Tabs
      aria-label="Catalog views"
      items={[
        { value: "products", label: "Products", content: "Product catalog" },
        { value: "imports", label: "Imports", content: "Import history" },
      ]}
    />
  ),
};
