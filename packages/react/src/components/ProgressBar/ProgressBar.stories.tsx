import { ProgressBar } from "./ProgressBar";

export default {
  title: "Components/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Progress of a task with a required label (visible or hidden) and a tone.\n\n**Do:** switch to `success` when complete. **Don\'t:** use it for waits of unknown length.\n\n**Usage**\n\n```tsx\nimport { ProgressBar } from "@kalaa/react";\n\n<ProgressBar label="Import progress" value={45} />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { max: 100, tone: "accent", hideLabel: false },
  argTypes: {
    value: { control: "range" },
    max: { control: "number" },
    label: { control: "text" },
    hideLabel: { control: "boolean" },
    tone: { control: "select", options: ["accent", "success", "warning", "danger"] },
    className: { control: false },
    ref: { control: false },
  },
};
export const Accent = { args: { label: "Import progress", value: 45 } };
export const Success = { args: { label: "Import complete", value: 100, tone: "success" } };
export const Warning = { args: { label: "Review progress", value: 60, tone: "warning" } };
export const Danger = { args: { label: "Failed imports", value: 20, tone: "danger" } };
export const States = { args: { label: "Import progress", value: 0, hideLabel: true } };
