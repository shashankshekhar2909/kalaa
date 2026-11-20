import { BarChart, type BarChartProps } from "./BarChart";

const ALL_SERIES = [
  { id: "approved", label: "Approved imports", data: [142, 168, 154, 189, 212, 198] },
  { id: "review", label: "Needs review", data: [28, 34, 22, 31, 19, 24] },
  { id: "rejected", label: "Rejected rows", data: [9, 12, 7, 8, 5, 6] },
];

type StoryArgs = BarChartProps & { seriesCount?: number };

export default {
  title: "Charts/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Vertical or horizontal, grouped or stacked SVG bar chart supporting positive and negative domains around a zero baseline, hatch pattern overlays, direct value labels, roving-tabIndex keyboard navigation, and a "Show data" Kalaa Table toggle.\n\n**Do:** keep direct value labels or patterns enabled when comparing multiple series. **Don\'t:** truncate the value axis above zero.\n\n**Usage**\n\n```tsx\nimport { BarChart } from "@kalaa/react";\n\n<BarChart\n  label="Weekly catalog imports"\n  categories={["W1", "W2", "W3", "W4"]}\n  series={[{ label: "Approved", data: [142, 168, 154, 189] }]}\n/>\n```',
      },
    },
  },
  args: {
    label: "Weekly catalog import counts",
    categories: ["W1", "W2", "W3", "W4", "W5", "W6"],
    series: ALL_SERIES,
    seriesCount: 2,
    orientation: "vertical",
    stacked: false,
    showLegend: true,
    showGrid: true,
    showValues: true,
    showPatterns: true,
    showDataToggle: true,
  },
  argTypes: {
    seriesCount: { control: { type: "range", min: 1, max: 3, step: 1 } },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    stacked: { control: "boolean" },
    showLegend: { control: "boolean" },
    showGrid: { control: "boolean" },
    showValues: { control: "boolean" },
    showPatterns: { control: "boolean" },
    showDataToggle: { control: "boolean" },
    yMin: { control: "number" },
    yMax: { control: "number" },
    min: { control: "number" },
    max: { control: "number" },
    series: { control: false },
    categories: { control: false },
  },
  render: ({ seriesCount = 2, series, ...args }: StoryArgs) => (
    <div style={{ maxInlineSize: "680px", padding: "16px" }}>
      <BarChart {...args} series={(series ?? ALL_SERIES).slice(0, seriesCount)} />
    </div>
  ),
};

export const CatalogImportsGrouped = {
  args: { seriesCount: 2, orientation: "vertical", stacked: false },
};

export const CatalogImportsStacked = {
  args: { seriesCount: 3, orientation: "vertical", stacked: true },
};

export const JobApplicationsHorizontal = {
  args: {
    label: "Job applications per week by stage",
    categories: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    series: [
      { id: "applied", label: "Applied", data: [11, 14, 12, 16, 15] },
      { id: "interview", label: "Interview", data: [3, 5, 4, 6, 7] },
    ],
    seriesCount: 2,
    orientation: "horizontal",
    stacked: false,
  },
};
