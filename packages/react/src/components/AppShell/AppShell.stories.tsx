import { AppShell } from "./AppShell";

export default {
  title: "Components/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Page frame with a sticky 240px sidebar and a main area (max 1120px). Use it once per app, with `AppShell.NavItem` children in `nav`.\n\n**Do:** mark the current page with `active`. **Don\'t:** nest shells or put page actions in the sidebar.\n\n**Usage**\n\n```tsx\nimport { AppShell } from "@kalaa/react";\n\n<AppShell nav={<AppShell.NavItem href="/products" active>Products</AppShell.NavItem>}>\n  <PageHeader title="Products" />\n</AppShell>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  argTypes: {
    nav: { control: false },
    header: { control: "text" },
    children: { control: false },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {
  args: {
    nav: (
      <>
        <AppShell.NavItem href="#products" active>
          Products
        </AppShell.NavItem>
        <AppShell.NavItem href="#imports">Imports</AppShell.NavItem>
      </>
    ),
    children: <h1>Products</h1>,
  },
};
export const States = {
  args: {
    nav: <AppShell.NavItem href="#review">Products requiring review</AppShell.NavItem>,
    children: <h1>Catalog</h1>,
  },
};
