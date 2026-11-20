import { Spinner } from "./Spinner";
export default {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Indeterminate activity ring using `currentColor` and `--kalaa-radius-full`. Announces `role="status"` with a visually hidden label unless marked `decorative` (as inside `Button loading`).\n\n**Do:** pair with visible context or a descriptive `label`. **Don\'t:** show multiple spinners in the same card; use `Skeleton` for layout placeholders.\n\n**Usage**\n\n```tsx\nimport { Spinner } from "@kalaa/react";\n\n<Spinner label="Validating import rows" />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { size: "md", label: "Loading catalog", decorative: false },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    label: { control: "text" },
    decorative: { control: "boolean" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {};
export const Sizes = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--kalaa-space-4)" }}>
      <Spinner size="sm" label="Loading small" />
      <Spinner size="md" label="Loading medium" />
      <Spinner size="lg" label="Loading large" />
    </div>
  ),
};
