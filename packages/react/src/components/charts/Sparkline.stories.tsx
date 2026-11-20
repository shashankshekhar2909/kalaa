import { Sparkline } from "./Sparkline";

export default {
  title: "Charts/Sparkline",
  component: Sparkline,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Compact inline trend line with a generated `role="img"` summary and end marker.\n\n**Do:** pair with a tabular figure or table cell so the exact current value is readable. **Don\'t:** use a sparkline when the reader needs labelled axes or point-by-point inspection.\n\n**Usage**\n\n```tsx\nimport { Sparkline } from "@kalaa/react";\n\n<Sparkline label="Catalog imports over 8 weeks" data={[112, 128, 119, 142, 156, 149, 168, 184]} area />\n```',
      },
    },
  },
  args: {
    label: "Catalog imports over 8 weeks",
    data: [112, 128, 119, 142, 156, 149, 168, 184],
    width: 140,
    height: 36,
    tone: "chart-1",
    area: true,
    showEndMarker: true,
  },
  argTypes: {
    label: { control: "text" },
    tone: {
      control: "select",
      options: ["chart-1", "chart-2", "chart-3", "chart-4", "accent", "success", "warning", "danger"],
    },
    width: { control: { type: "range", min: 80, max: 240, step: 10 } },
    height: { control: { type: "range", min: 24, max: 64, step: 4 } },
    area: { control: "boolean" },
    showEndMarker: { control: "boolean" },
    data: { control: "object" },
    formatValue: { control: false },
    className: { control: false },
  },
};

export const Default = {};

export const Variants = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center", padding: "16px" }}>
      <Sparkline
        label="Catalog imports per week"
        data={[112, 128, 119, 142, 156, 149, 168, 184]}
        tone="chart-1"
        area
      />
      <Sparkline
        label="Job applications per week"
        data={[9, 12, 11, 14, 13, 16, 15, 18]}
        tone="chart-3"
        area
      />
      <Sparkline label="Failed import rows" data={[28, 24, 19, 22, 15, 11, 9, 6]} tone="chart-2" />
    </div>
  ),
};
