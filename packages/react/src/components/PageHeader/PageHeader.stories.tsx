import { PageHeader } from "./PageHeader";

export default {
  title: "Components/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Title row for a page: optional back link, one `h1`, muted description and right-aligned actions.\n\n**Do:** use one per page and at most one primary action. **Don\'t:** add eyebrow labels; `variant="brand"` (serif) is for marketing pages only.\n\n**Usage**\n\n```tsx\nimport { PageHeader } from "@kalaa/react";\n\n<PageHeader title="Products" description="Manage your catalog." actions={<Button variant="primary">Add product</Button>} />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { variant: "default" },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    back: { control: "object" },
    actions: { control: false },
    variant: { control: "inline-radio", options: ["default", "brand"] },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = { args: { title: "Products", description: "Manage your catalog." } };
export const Brand = { args: { title: "Kalaa", variant: "brand" } };
export const States = {
  args: {
    title: "Products requiring a detailed review",
    back: { href: "#catalog", label: "Back to catalog" },
    actions: <button type="button">Add product</button>,
  },
};
