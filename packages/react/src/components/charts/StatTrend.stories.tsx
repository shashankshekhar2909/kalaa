import { StatTrend } from "./StatTrend";

export default {
  title: "Charts/StatTrend",
  component: StatTrend,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Metric summary card combining a tabular headline figure, an inline sparkline, and a directional delta badge (`↑`, `↓`, `→`).\n\n**Do:** always include the comparison period (`"vs last week"`) and use `sentiment` when a downward trend is good (such as failed imports). **Don\'t:** rely on red/green colour alone without the directional arrow.\n\n**Usage**\n\n```tsx\nimport { StatTrend } from "@kalaa/react";\n\n<StatTrend\n  label="Catalog imports"\n  value="1,482"\n  delta="+14.2%"\n  trend="up"\n  period="vs last week"\n  data={[162, 174, 169, 185, 192, 204, 198, 218]}\n/>\n```',
      },
    },
  },
  args: {
    label: "Catalog imports",
    value: "1,482",
    delta: "+14.2%",
    trend: "up",
    sentiment: "positive",
    period: "vs last week",
    data: [162, 174, 169, 185, 192, 204, 198, 218],
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    delta: { control: "text" },
    trend: { control: "inline-radio", options: ["up", "down", "flat"] },
    sentiment: { control: "inline-radio", options: ["positive", "negative", "neutral"] },
    period: { control: "text" },
    data: { control: "object" },
    className: { control: false },
  },
};

export const Default = {};

export const OverviewGrid = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        padding: "16px",
      }}
    >
      <StatTrend
        label="Catalog imports"
        value="1,482"
        delta="+14.2%"
        trend="up"
        sentiment="positive"
        period="vs last week"
        data={[162, 174, 169, 185, 192, 204, 198, 218]}
      />
      <StatTrend
        label="Job applications sent"
        value="64"
        delta="+6"
        trend="up"
        sentiment="positive"
        period="across 6 weeks"
        data={[8, 10, 9, 11, 12, 14]}
      />
      <StatTrend
        label="Extraction accuracy"
        value="96.4%"
        delta="+1.8 pts"
        trend="up"
        sentiment="positive"
        period="since v0.4 model"
        data={[91.2, 92.5, 93.1, 94.6, 95.8, 96.4]}
      />
      <StatTrend
        label="Unverified records"
        value="19"
        delta="-32%"
        trend="down"
        sentiment="positive"
        period="vs last batch"
        data={[42, 36, 31, 28, 23, 19]}
      />
    </div>
  ),
};
