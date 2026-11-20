import { AppShell } from "./AppShell";

export default {
  title: "Components/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Page frame with a sticky 240px sidebar (full-page background) and a main area (max 1120px). Use it once per app, with `brand`, `AppShell.NavItem` children in `nav`, and `footer` for account or theme utilities. Pass `render={<NextLink href="..." />}` on `NavItem` for client-side routing.\n\n**Do:** mark the current page with `active` and use `brand` and `footer` for chrome outside the nav list. **Don\'t:** nest shells or put page actions in the sidebar.\n\n**Usage**\n\n```tsx\nimport NextLink from "next/link";\nimport { AppShell } from "@kalaa/react";\n\n<AppShell\n  brand="Catalog Admin"\n  nav={<AppShell.NavItem render={<NextLink href="/products" />} active>Products</AppShell.NavItem>}\n  footer={<button type="button">Sign out</button>}\n>\n  <PageHeader title="Products" />\n</AppShell>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  argTypes: {
    nav: { control: false },
    brand: { control: "text" },
    footer: { control: false },
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
export const WithBrandAndFooter = {
  args: {
    brand: "Catalog Admin",
    nav: (
      <>
        <AppShell.NavItem href="#products" active>
          Products
        </AppShell.NavItem>
        <AppShell.NavItem href="#imports">Imports</AppShell.NavItem>
        <AppShell.NavItem href="#review">Review queue</AppShell.NavItem>
      </>
    ),
    footer: (
      <span style={{ fontSize: "var(--kalaa-font-size-xs)", color: "var(--kalaa-text-muted)" }}>
        Signed in as ops@kalaa.dev
      </span>
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
