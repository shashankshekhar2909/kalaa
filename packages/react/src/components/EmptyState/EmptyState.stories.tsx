import { EmptyState } from "./EmptyState";

export default {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Centred message for a list or area with nothing in it, with one optional next step.\n\n**Do:** say what is missing and what to do. **Don\'t:** show it while data is loading.\n\n**Usage**\n\n```tsx\nimport { EmptyState } from "@kalaa/react";\n\n<EmptyState title="No products yet" description="Add a product to start your catalog." />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    action: { control: false },
    className: { control: false },
    ref: { control: false },
  },
};
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
