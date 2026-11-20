import { ChartLegend } from "./ChartLegend";

export default {
  title: "Charts/ChartLegend",
  component: ChartLegend,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible legend list pairing each series colour with its SVG hatch pattern or geometric marker shape.\n\n**Do:** match `symbol="marker"` to line charts and `symbol="swatch"` to bar or donut charts. **Don\'t:** show a legend when there is only a single series.\n\n**Usage**\n\n```tsx\nimport { ChartLegend } from "@kalaa/react";\n\n<ChartLegend\n  items={[\n    { label: "Approved imports", value: "840" },\n    { label: "Needs review", value: "190" },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    symbol: "swatch",
    items: [
      { id: "approved", label: "Approved imports", value: "840", seriesIndex: 0 },
      { id: "review", label: "Needs review", value: "190", seriesIndex: 1 },
      { id: "rejected", label: "Rejected rows", value: "52", seriesIndex: 2 },
      { id: "unverified", label: "Unverified", value: "90", seriesIndex: 3 },
    ],
  },
  argTypes: {
    symbol: { control: "inline-radio", options: ["swatch", "marker"] },
    items: { control: "object" },
    className: { control: false },
  },
};

export const SwatchLegend = {
  args: { symbol: "swatch" },
};

export const MarkerLegend = {
  args: { symbol: "marker" },
};
