import { Avatar } from "./Avatar";
export default {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Compact identity badge showing an image or initials derived from `name`. Uses `--kalaa-radius-full` for circular user badges and `--kalaa-radius-md` (`shape="square"`) for workspaces or teams.\n\n**Do:** always pass `name` so initials and the accessible name work even when an image fails to load. **Don\'t:** assign random rainbow background colours per user.\n\n**Usage**\n\n```tsx\nimport { Avatar } from "@kalaa/react";\n\n<Avatar name="Asha Rao" />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { name: "Asha Rao", size: "md", shape: "circle" },
  argTypes: {
    name: { control: "text" },
    initials: { control: "text" },
    src: { control: "text" },
    alt: { control: "text" },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    shape: { control: "inline-radio", options: ["circle", "square"] },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {};
export const SizesAndShapes = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--kalaa-space-3)" }}>
      <Avatar name="Asha Rao" size="sm" />
      <Avatar name="Shashank" size="md" />
      <Avatar name="Catalog Ops" size="lg" shape="square" />
    </div>
  ),
};
