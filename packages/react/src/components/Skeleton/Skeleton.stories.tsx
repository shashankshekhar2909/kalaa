import { Skeleton } from "./Skeleton";
export default {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Layout placeholder shown while records or cards load. Decorative (`aria-hidden="true"`); pulses gently and stops under `prefers-reduced-motion`.\n\n**Do:** match the approximate dimensions of the real content and pair the loading region with `aria-busy="true"`. **Don\'t:** leave skeletons on screen when a request fails; show a `Banner` or `EmptyState`.\n\n**Usage**\n\n```tsx\nimport { Skeleton } from "@kalaa/react";\n\n<div aria-busy="true" aria-label="Loading product">\n  <Skeleton variant="text" width="40%" />\n  <Skeleton variant="block" />\n</div>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { variant: "text", width: "60%" },
  argTypes: {
    variant: { control: "inline-radio", options: ["text", "block", "circle"] },
    width: { control: "text" },
    height: { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {};
export const Variants = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--kalaa-space-3)", maxWidth: 360 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--kalaa-space-3)" }}>
        <Skeleton variant="circle" />
        <div style={{ flex: 1, display: "grid", gap: "var(--kalaa-space-2)" }}>
          <Skeleton variant="text" width="55%" />
          <Skeleton variant="text" width="80%" />
        </div>
      </div>
      <Skeleton variant="block" />
    </div>
  ),
};
