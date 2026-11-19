import { StatusBadge } from "./StatusBadge";
export default {
  title: "Components/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'A Badge whose tone comes from a status word, in one mapping table: approved is success, needs review is warning, rejected is danger.\n\n**Do:** pass the raw status word. **Don\'t:** pick tones by hand elsewhere.\n\n**Usage**\n\n```tsx\nimport { StatusBadge } from "@kalaa/react";\n\n<StatusBadge status="needs review" />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  argTypes: {
    status: { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Neutral = { args: { status: "draft" } };
export const Info = { args: { status: "imported" } };
export const Success = { args: { status: "approved" } };
export const Warning = { args: { status: "needs review" } };
export const Danger = { args: { status: "failed" } };
export const States = { args: { status: "unknown status" } };
