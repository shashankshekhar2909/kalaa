import { StatsBand } from "./StatsBand";
import { sampleLandingPageData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Marketing/StatsBand",
  component: StatsBand,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Horizontal benchmark and KPI band rendering figures with `font-variant-numeric: tabular-nums` inside a semantic `<dl>`.\n\n**Do:** pair every figure with a clear unit and benchmark context in `detail`. **Don\'t:** show vanity numbers without units.\n\n**Usage**\n\n```tsx\nimport { StatsBand } from "@kalaa/react";\n\n<StatsBand\n  heading="Measured under real substation fault bursts"\n  stats={[\n    { label: "Ingest throughput", value: "1.4M/s", detail: "Per 4-core regional node" },\n    { label: "Failover recovery", value: "22 s", detail: "Zero dropped frames" },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    heading: sampleLandingPageData.stats?.heading,
    description: sampleLandingPageData.stats?.description,
    stats: sampleLandingPageData.stats?.items ?? [],
    headingLevel: 2,
  },
  argTypes: {
    heading: { control: "text" },
    description: { control: "text" },
    stats: { control: "object" },
    headingLevel: { control: "inline-radio", options: [2, 3] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    heading: undefined,
    description: undefined,
    stats: (sampleLandingPageData.stats?.items ?? []).slice(0, 2),
  },
};
