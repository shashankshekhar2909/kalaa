import { ChartTooltip } from "./ChartTooltip";

export default {
  title: "Charts/ChartTooltip",
  component: ChartTooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'High-contrast bordered tooltip surface with geometric series markers and tabular values. No drop shadow or blur.\n\n**Do:** show exact tabular figures on keyboard focus as well as pointer hover. **Don\'t:** put interactive buttons inside a tooltip.\n\n**Usage**\n\n```tsx\nimport { ChartTooltip } from "@kalaa/react";\n\n<ChartTooltip\n  label="Week 4"\n  items={[\n    { label: "Approved imports", value: "189", seriesIndex: 0 },\n    { label: "Needs review", value: "31", seriesIndex: 1 },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    label: "Week 4 · Nov 14",
    open: true,
    items: [
      { label: "Approved imports", value: "189", seriesIndex: 0 },
      { label: "Needs review", value: "31", seriesIndex: 1 },
      { label: "Rejected rows", value: "8", seriesIndex: 2 },
    ],
  },
  argTypes: {
    label: { control: "text" },
    open: { control: "boolean" },
    items: { control: "object" },
    floating: { control: false },
    className: { control: false },
  },
};

export const Default = {};
