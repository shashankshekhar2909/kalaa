import { ProgressRing } from "./ProgressRing";

export default {
  title: "Charts/ProgressRing",
  component: ProgressRing,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Circular completion gauge with a centred tabular percentage and square stroke terminals.\n\n**Do:** use for bounded completion or accuracy ratios (0–100%). **Don\'t:** use for multi-part breakdowns; use `DonutChart` instead.\n\n**Usage**\n\n```tsx\nimport { ProgressRing } from "@kalaa/react";\n\n<ProgressRing label="Catalog verified" value={88} />\n```',
      },
    },
  },
  args: {
    label: "Catalog verified",
    value: 88,
    max: 100,
    size: "md",
    tone: "chart-1",
    hideLabel: false,
  },
  argTypes: {
    label: { control: "text" },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    max: { control: "number" },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    tone: {
      control: "select",
      options: ["chart-1", "chart-2", "chart-3", "accent", "success", "warning", "danger"],
    },
    hideLabel: { control: "boolean" },
    className: { control: false },
  },
};

export const Default = {};

export const SizesAndTones = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "center", padding: "16px" }}>
      <ProgressRing label="Import batch" value={94} size="sm" tone="chart-3" />
      <ProgressRing label="Field accuracy" value={88} size="md" tone="chart-1" />
      <ProgressRing label="Review queue" value={62} size="lg" tone="chart-2" />
    </div>
  ),
};
