import { Card } from "./Card";

export default { title: "Components/Card", component: Card };
export const Default = {
  args: { title: "Products", description: "Manage your catalog.", children: "24 products" },
};
export const States = {
  args: {
    title: "A long product collection name for review",
    actions: <button type="button">Edit</button>,
    children: "No products require attention.",
  },
};
