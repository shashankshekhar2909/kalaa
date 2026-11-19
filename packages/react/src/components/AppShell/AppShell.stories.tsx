import { AppShell } from "./AppShell";

export default { title: "Components/AppShell", component: AppShell };
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
