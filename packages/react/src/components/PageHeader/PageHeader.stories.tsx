import { PageHeader } from "./PageHeader";

export default { title: "Components/PageHeader", component: PageHeader };
export const Default = { args: { title: "Products", description: "Manage your catalog." } };
export const Brand = { args: { title: "Kalaa", variant: "brand" } };
export const States = {
  args: {
    title: "Products requiring a detailed review",
    back: { href: "#catalog", label: "Back to catalog" },
    actions: <button type="button">Add product</button>,
  },
};
