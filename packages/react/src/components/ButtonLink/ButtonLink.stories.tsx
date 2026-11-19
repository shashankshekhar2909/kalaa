import { ButtonLink } from "./ButtonLink";
export default { title: "Components/ButtonLink", component: ButtonLink };
export const Primary = { args: { href: "#products", variant: "primary", children: "View products" } };
export const Secondary = { args: { href: "#imports", children: "View imports" } };
export const Ghost = { args: { href: "#catalog", variant: "ghost", children: "View catalog" } };
export const Danger = { args: { href: "#delete", variant: "danger", children: "Delete product" } };
export const States = {
  args: { href: "#review", size: "sm", children: "Review a long list of imported products" },
};
