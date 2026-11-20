import { DonutChart } from "./DonutChart";

export default {
  title: "Charts/DonutChart",
  component: DonutChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Part-to-whole ring chart capped at 6 slices (excess slices roll into "Other"), with a centred tabular total, SVG hatch pattern overlays, direct percentage labels, keyboard-focusable slices, and a "Show data" Kalaa Table toggle.\n\n**Do:** use for up to 6 slices that sum to a meaningful total. **Don\'t:** use for comparing fine differences across many categories; use a horizontal `BarChart` instead.\n\n**Usage**\n\n```tsx\nimport { DonutChart } from "@kalaa/react";\n\n<DonutChart\n  label="Catalog records by review state"\n  centerLabel="Records"\n  data={[\n    { label: "Approved", value: 840 },\n    { label: "Needs review", value: 190 },\n    { label: "Rejected", value: 52 },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    label: "Catalog records by review state",
    centerLabel: "Records",
    data: [
      { id: "approved", label: "Approved", value: 840 },
      { id: "imported", label: "Imported", value: 310 },
      { id: "review", label: "Needs review", value: 190 },
      { id: "unverified", label: "Unverified", value: 90 },
      { id: "rejected", label: "Rejected", value: 52 },
    ],
    showLegend: true,
    showDirectLabels: true,
    showPatterns: true,
    showDataToggle: true,
  },
  argTypes: {
    label: { control: "text" },
    centerLabel: { control: "text" },
    showLegend: { control: "boolean" },
    showDirectLabels: { control: "boolean" },
    showPatterns: { control: "boolean" },
    showDataToggle: { control: "boolean" },
    data: { control: "object" },
  },
};

export const Default = {
  render: (args: Parameters<typeof DonutChart>[0]) => (
    <div style={{ maxInlineSize: "640px", padding: "16px" }}>
      <DonutChart {...args} />
    </div>
  ),
};
