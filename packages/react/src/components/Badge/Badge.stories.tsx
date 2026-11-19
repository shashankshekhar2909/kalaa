import { Badge, StatusBadge } from "./Badge";

export default {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Small label with a tone (neutral, info, success, warning, danger). Status colours are for status only.\n\n**Do:** keep it to one or two words in sentence case. **Don\'t:** use it as a button or for decoration.\n\n**Usage**\n\n```tsx\nimport { Badge } from "@kalaa/react";\n\n<Badge tone="success">Approved</Badge>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { tone: "neutral" },
  argTypes: {
    tone: { control: "select", options: ["neutral", "info", "success", "warning", "danger"] },
    children: { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Neutral = { args: { children: "Draft" } };
export const Info = { args: { tone: "info", children: "Imported" } };
export const Success = { args: { tone: "success", children: "Approved" } };
export const Warning = { args: { tone: "warning", children: "Needs review" } };
export const Danger = { args: { tone: "danger", children: "Failed" } };
export const States = {
  render: () => (
    <>
      <StatusBadge status="needs review" /> <StatusBadge status="unknown status" />
    </>
  ),
};
