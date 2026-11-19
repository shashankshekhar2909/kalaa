import { Card } from "./Card";

export default {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Bordered surface that groups related content. A header row appears only when there is a title or actions.\n\n**Do:** keep cards in a grid with a 16px gap and use `titleLevel` to keep headings in order. **Don\'t:** nest cards or rely on shadow; the 1px border carries the shape.\n\n**Usage**\n\n```tsx\nimport { Card } from "@kalaa/react";\n\n<Card title="Products" description="Manage your catalog.">24 products</Card>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { titleLevel: 2 },
  argTypes: {
    as: { control: "select", options: ["section", "div", "article"] },
    title: { control: "text" },
    description: { control: "text" },
    actions: { control: false },
    titleLevel: { control: "inline-radio", options: [2, 3, 4] },
    children: { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
};
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
