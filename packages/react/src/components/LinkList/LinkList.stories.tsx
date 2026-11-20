import { LinkList } from "./LinkList";
import { samplePortfolioData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Profile & portfolio/LinkList",
  component: LinkList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Annotated link collection for writing, talks, repositories or profile hubs. Supports `"stacked"` rows with descriptions or compact `"inline"` rows.\n\n**Do:** use descriptive link titles and add a short `meta` badge (e.g. "Paper", "GitHub"). **Don\'t:** display raw full URLs as the link label.\n\n**Usage**\n\n```tsx\nimport { LinkList } from "@kalaa/react";\n\n<LinkList\n  heading="Selected writing"\n  items={[\n    {\n      label: "Deterministic rollup compaction paper",\n      href: "https://papers.example.invalid/sits-2025-rollup",\n      description: "Symposium on Industrial Telemetry Systems (2025)",\n      meta: "Paper",\n    },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    heading: "Selected writing & code",
    items: samplePortfolioData.links ?? [],
    variant: "stacked",
    headingLevel: 2,
  },
  argTypes: {
    heading: { control: "text" },
    items: { control: "object" },
    variant: { control: "inline-radio", options: ["stacked", "inline"] },
    headingLevel: { control: "inline-radio", options: [2, 3] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const Inline = {
  args: {
    heading: "Profiles",
    variant: "inline",
  },
};

export const States = {
  args: {
    heading: undefined,
    variant: "inline",
    items: [{ label: "GitHub", href: "https://github.example.invalid/aarav-deshmukh" }],
  },
};
