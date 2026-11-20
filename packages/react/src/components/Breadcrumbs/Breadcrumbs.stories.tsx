import { Breadcrumbs } from "./Breadcrumbs";
export default {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Hierarchical trail inside a `<nav aria-label="Breadcrumb">` landmark, marking the final item with `aria-current="page"`. Supports client-side routing via `render` on each item.\n\n**Do:** use it when pages nest three or more levels deep. **Don\'t:** duplicate the top-level sidebar on flat pages; a single parent link fits better in `PageHeader back`.\n\n**Usage**\n\n```tsx\nimport NextLink from "next/link";\nimport { Breadcrumbs } from "@kalaa/react";\n\n<Breadcrumbs\n  items={[\n    { label: "Catalog", href: "/catalog", render: <NextLink href="/catalog" /> },\n    { label: "Imports", href: "/catalog/imports", render: <NextLink href="/catalog/imports" /> },\n    { label: "Batch #1042" },\n  ]}\n/>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: {
    items: [
      { label: "Catalog", href: "#catalog" },
      { label: "Imports", href: "#imports" },
      { label: "Batch #1042" },
    ],
  },
  argTypes: {
    items: { control: "object" },
    label: { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {};
export const DeepPath = {
  args: {
    items: [
      { label: "Catalog", href: "#catalog" },
      { label: "Beverages", href: "#beverages" },
      { label: "Roasters", href: "#roasters" },
      { label: "Monsoon Malabar 250g" },
    ],
  },
};
