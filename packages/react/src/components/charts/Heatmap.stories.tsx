import { Heatmap } from "./Heatmap";

export default {
  title: "Charts/Heatmap",
  component: Heatmap,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Calendar and grid activity matrix using the 5-step sequential or diverging token ramp (with an explicit neutral `center` midpoint and threshold legend), direct cell values, horizontally scrollable wide matrices, 2D arrow-key roving-tabIndex navigation, and a "Show data" Kalaa Table toggle.\n\n**Do:** keep direct cell figures visible so intensity is readable without colour. **Don\'t:** use a diverging ramp unless the data has a meaningful midpoint.\n\n**Usage**\n\n```tsx\nimport { Heatmap } from "@kalaa/react";\n\n<Heatmap\n  label="Catalog imports by weekday and week"\n  rows={["Mon", "Tue", "Wed", "Thu", "Fri"]}\n  columns={["W1", "W2", "W3", "W4"]}\n  values={[\n    [24, 32, 28, 41],\n    [19, 27, 35, 38],\n    [31, 44, 39, 52],\n    [22, 29, 33, 45],\n    [14, 18, 21, 26],\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    label: "Catalog imports by weekday and week",
    rows: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    columns: ["W1", "W2", "W3", "W4", "W5", "W6"],
    values: [
      [24, 32, 28, 41, 36, 48],
      [19, 27, 35, 38, 44, 51],
      [31, 44, 39, 52, 49, 63],
      [22, 29, 33, 45, 42, 54],
      [14, 18, 21, 26, 29, 34],
    ],
    ramp: "sequential",
    showValues: true,
    showLegend: true,
    showDataToggle: true,
  },
  argTypes: {
    label: { control: "text" },
    ramp: { control: "inline-radio", options: ["sequential", "diverging"] },
    center: { control: "number" },
    showValues: { control: "boolean" },
    showLegend: { control: "boolean" },
    showDataToggle: { control: "boolean" },
    rows: { control: false },
    columns: { control: false },
    values: { control: false },
  },
  render: (args: Parameters<typeof Heatmap>[0]) => (
    <div style={{ maxInlineSize: "680px", padding: "16px" }}>
      <Heatmap {...args} />
    </div>
  ),
};

export const SequentialActivity = {
  args: { ramp: "sequential" },
};

export const DivergingAccuracyDelta = {
  args: {
    label: "Accuracy delta vs baseline (percentage points)",
    rows: ["Title", "Price", "SKU", "Category"],
    columns: ["Batch 1", "Batch 2", "Batch 3", "Batch 4", "Batch 5"],
    values: [
      [-4, -1, 0, 2, 4],
      [-6, -3, -1, 1, 3],
      [-2, 0, 1, 3, 5],
      [-5, -2, 0, 2, 4],
    ],
    ramp: "diverging",
  },
};
