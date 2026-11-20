import { LineChart, type LineChartProps } from "./LineChart";

const ACCURACY_SERIES = [
  { id: "title", label: "Title extraction", data: [91.4, 92.8, 94.1, 95.3, 96.2, 97.1] },
  { id: "price", label: "Price normalization", data: [88.0, 89.5, 91.2, 93.4, 94.8, 95.9] },
  { id: "category", label: "Category mapping", data: [82.5, 84.9, 86.4, 88.8, 90.7, 92.4] },
];

type StoryArgs = LineChartProps & { seriesCount?: number };

export default {
  title: "Charts/LineChart",
  component: LineChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Multi-series line and optional area chart with distinct stroke dash patterns, geometric point markers, direct end-of-series labels, keyboard-focusable points, and a "Show data" Kalaa Table toggle.\n\n**Do:** keep distinct markers and dash styles so series remain clear without colour. **Don\'t:** plot more than 4–5 overlapping lines in a single frame.\n\n**Usage**\n\n```tsx\nimport { LineChart } from "@kalaa/react";\n\n<LineChart\n  label="Field accuracy over time"\n  categories={["v0.1", "v0.2", "v0.3", "v0.4"]}\n  series={[{ label: "Title extraction", data: [91.4, 94.1, 96.2, 97.1] }]}\n/>\n```',
      },
    },
  },
  args: {
    label: "Catalog field accuracy over time (%)",
    categories: ["Oct W1", "Oct W2", "Oct W3", "Oct W4", "Nov W1", "Nov W2"],
    series: ACCURACY_SERIES,
    seriesCount: 3,
    area: false,
    showLegend: true,
    showGrid: true,
    showDirectLabels: true,
    showDataToggle: true,
    yMin: 75,
    yMax: 100,
  },
  argTypes: {
    seriesCount: { control: { type: "range", min: 1, max: 3, step: 1 } },
    area: { control: "boolean" },
    showLegend: { control: "boolean" },
    showGrid: { control: "boolean" },
    showDirectLabels: { control: "boolean" },
    showDataToggle: { control: "boolean" },
    series: { control: false },
    categories: { control: false },
  },
  render: ({ seriesCount = 3, series, ...args }: StoryArgs) => (
    <div style={{ maxInlineSize: "680px", padding: "16px" }}>
      <LineChart {...args} series={(series ?? ACCURACY_SERIES).slice(0, seriesCount)} />
    </div>
  ),
};

export const AccuracyOverTime = {
  args: { seriesCount: 3, area: false },
};

export const JobApplicationsArea = {
  args: {
    label: "Job applications and responses per week",
    categories: ["W1", "W2", "W3", "W4", "W5", "W6"],
    series: [
      { id: "sent", label: "Applications sent", data: [9, 12, 11, 15, 14, 18] },
      { id: "replies", label: "Recruiter replies", data: [3, 5, 4, 7, 6, 9] },
    ],
    seriesCount: 2,
    area: true,
    yMin: 0,
    yMax: 20,
  },
};
