import { Link } from "./Link";
export default {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Inline text link in the accent colour, always underlined so it does not rely on colour alone. Pass `render={<NextLink href="..." />}` for client-side routing in Next.js.\n\n**Do:** use it inside sentences, tables and help copy. **Don\'t:** use it for primary page actions; use `ButtonLink`.\n\n**Usage**\n\n```tsx\nimport NextLink from "next/link";\nimport { Link } from "@kalaa/react";\n\n<p>\n  See the <Link render={<NextLink href="/imports" />}>import history</Link> for row-level errors.\n</p>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { href: "#imports", children: "View import history" },
  argTypes: {
    href: { control: "text" },
    children: { control: "text" },
    render: { control: false },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {};
export const InlineInCopy = {
  render: () => (
    <p style={{ margin: 0, color: "var(--kalaa-text)", fontFamily: "var(--kalaa-font-sans)" }}>
      Twelve records failed validation. Open the <Link href="#log">import error log</Link> or read the{" "}
      <Link href="#schema">catalog schema specification</Link>.
    </p>
  ),
};
