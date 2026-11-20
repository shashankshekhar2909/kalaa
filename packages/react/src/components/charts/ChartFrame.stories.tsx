import { BarChart } from "./BarChart";
import { ChartFrame } from "./ChartFrame";

const CATEGORIES = ["W1", "W2", "W3", "W4", "W5", "W6"];
const SERIES = [
  { id: "approved", label: "Approved imports", data: [142, 168, 154, 189, 212, 198] },
  { id: "review", label: "Needs review", data: [28, 34, 22, 31, 19, 24] },
];

export default {
  title: "Charts/ChartFrame",
  component: ChartFrame,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Standard container for a chart: provides a title, description, legend slot, "Show data" Kalaa Table toggle, and consistent empty, loading, and error states.\n\n**Do:** state the metric unit and time window in `description`. **Don\'t:** hide errors silently when a chart query fails.\n\n**Usage**\n\n```tsx\nimport { ChartFrame, BarChart } from "@kalaa/react";\n\n<ChartFrame title="Catalog imports" description="Weekly records processed">\n  <BarChart categories={["W1", "W2"]} series={[{ label: "Approved", data: [142, 168] }]} />\n</ChartFrame>\n```',
      },
    },
  },
  args: {
    title: "Catalog import volume",
    description: "Weekly records processed across automated and reviewed batches.",
    state: "default",
    defaultShowData: false,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    state: { control: "inline-radio", options: ["default", "loading", "empty", "error"] },
    titleLevel: { control: "inline-radio", options: [2, 3, 4] },
    defaultShowData: { control: "boolean" },
    legend: { control: false },
    dataTable: { control: false },
    children: { control: false },
  },
  render: (args: Parameters<typeof ChartFrame>[0]) => (
    <div style={{ maxInlineSize: "720px", padding: "16px" }}>
      <ChartFrame
        {...args}
        legend={SERIES.map((s, i) => ({ id: s.id, label: s.label, seriesIndex: i }))}
        dataTable={{
          caption: "Catalog import volume by week",
          headers: ["Week", "Approved imports", "Needs review"],
          rows: CATEGORIES.map((c, idx) => [c, SERIES[0].data[idx], SERIES[1].data[idx]]),
        }}
      >
        <BarChart
          label="Catalog import volume"
          categories={CATEGORIES}
          series={SERIES}
          showLegend={false}
          showDataToggle={false}
        />
      </ChartFrame>
    </div>
  ),
};

export const Default = {};

export const States = {
  render: () => (
    <div style={{ display: "grid", gap: "16px", maxInlineSize: "720px", padding: "16px" }}>
      <ChartFrame title="Catalog import volume" description="Weekly records processed" state="loading" />
      <ChartFrame
        title="Job applications per week"
        description="No applications recorded in the selected window"
        state="empty"
      />
      <ChartFrame
        title="Extraction accuracy over time"
        description="Evaluation run metrics"
        state="error"
        error="Evaluation summary endpoint timed out after 10s."
      />
    </div>
  ),
};
