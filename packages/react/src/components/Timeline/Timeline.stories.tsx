import { Timeline } from "./Timeline";
import { samplePortfolioData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Profile & portfolio/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Chronological milestone list rendered as a semantic `<ol>` with `<time>` dates, role/project titles, subtitles and `Badge` tags.\n\n**Do:** keep entries ordered consistently (newest first for careers, oldest first for release roadmaps). **Don\'t:** omit `<time>` dates on timeline steps.\n\n**Usage**\n\n```tsx\nimport { Timeline } from "@kalaa/react";\n\n<Timeline\n  items={[\n    {\n      date: "2023-04",\n      endDate: "Present",\n      title: "Principal Systems Architect",\n      subtitle: "Vayu Grid Systems",\n      badge: "Current",\n    },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    heading: "Timeline",
    items: samplePortfolioData.timeline ?? [],
    headingLevel: 2,
  },
  argTypes: {
    heading: { control: "text" },
    items: { control: "object" },
    headingLevel: { control: "inline-radio", options: [2, 3] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    heading: "Release milestones",
    items: [
      {
        date: "2026-11",
        title: "Pravah 2.4 GA release",
        description: "Deterministic compaction and schema validation gateway.",
        badge: "Shipped",
      },
    ],
  },
};
