import { EmptyState } from "./EmptyState";

export default { title: "Components/EmptyState", component: EmptyState };
export const Default = {
  args: { title: "No products yet", description: "Add a product to start your catalog." },
};
export const States = {
  args: {
    title: "No imports need review",
    description: "Products that require additional information will appear here.",
    action: <button type="button">View products</button>,
  },
};
