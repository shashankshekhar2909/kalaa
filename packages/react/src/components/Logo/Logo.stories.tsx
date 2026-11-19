import { Logo } from "./Logo";

export default {
  title: "Components/Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'The Kalaa square: a frame (the unlit moon) with a lit L-shaped crescent, plus an optional wordmark lockup. Colours follow `--kalaa-text` and `--kalaa-accent`, so it changes with theme and accent.\n\n**Do:** keep the mark at least 16px (lockup at least 96px wide) with 8 units of clear space. **Don\'t:** rotate it, add gradients, round it or put it in a circle.\n\n**Usage**\n\n```tsx\nimport { Logo } from "@kalaa/react";\n\n<Logo variant="lockup" size={28} />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { variant: "mark" },
  argTypes: {
    variant: { control: "inline-radio", options: ["mark", "lockup"] },
    size: { control: "range", min: 16, max: 160, step: 4 },
    title: { control: "text" },
    mono: { control: "boolean" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Mark = { args: { variant: "mark", size: 64 } };
export const Lockup = { args: { variant: "lockup", size: 48 } };
export const Mono = { args: { variant: "mark", size: 64, mono: true } };
export const Sizes = {
  render: () => (
    <div style={{ display: "flex", alignItems: "end", gap: "var(--kalaa-space-6)" }}>
      {[16, 24, 32, 48, 64].map((size) => (
        <Logo key={size} size={size} />
      ))}
    </div>
  ),
};
