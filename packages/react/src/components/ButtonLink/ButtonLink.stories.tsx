import { ButtonLink } from "./ButtonLink";
export default {
  title: "Components/ButtonLink",
  component: ButtonLink,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'A link that looks like a Button, for navigation. Same variants and sizes; works with any router through `href` or the Base UI `render` prop (for example `next/link`).\n\n**Do:** use it when the action changes the URL, and pass `render={<NextLink href="..." />}` in Next.js. **Don\'t:** use a Button with `onClick` for navigation.\n\n**Usage**\n\n```tsx\nimport NextLink from "next/link";\nimport { ButtonLink } from "@kalaa/react";\n\n<ButtonLink variant="primary" render={<NextLink href="/products" />}>\n  View products\n</ButtonLink>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { variant: "secondary", size: "md" },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    href: { control: "text" },
    children: { control: "text" },
    iconStart: { control: false },
    iconEnd: { control: false },
    onClick: { action: "clicked" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Primary = { args: { href: "#products", variant: "primary", children: "View products" } };
export const Secondary = { args: { href: "#imports", children: "View imports" } };
export const Ghost = { args: { href: "#catalog", variant: "ghost", children: "View catalog" } };
export const Danger = { args: { href: "#delete", variant: "danger", children: "Delete product" } };
export const States = {
  args: { href: "#review", size: "sm", children: "Review a long list of imported products" },
};
