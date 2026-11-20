import { Awards, Publications } from "./Awards";
import { sampleResumeData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Resume/Awards",
  component: Awards,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Honours, awards and peer-reviewed publications list (`Awards` and `Publications`) with `<time>` dates, issuer details and category `Badge`.\n\n**Do:** cite the venue or conferring institution and year. **Don\'t:** omit links for publicly available papers.\n\n**Usage**\n\n```tsx\nimport { Awards } from "@kalaa/react";\n\n<Awards\n  items={[\n    {\n      title: "National Grid Resilience Engineering Award",\n      issuer: "Indian Power Systems Forum",\n      date: "2024-11",\n      kind: "award",\n    },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    heading: "Awards & publications",
    items: sampleResumeData.awards ?? [],
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

export const PublicationsOnly = {
  render: () => (
    <Publications items={(sampleResumeData.awards ?? []).filter((item) => item.kind === "publication")} />
  ),
};

export const States = {
  args: {
    heading: "Awards",
    items: (sampleResumeData.awards ?? []).filter((item) => item.kind === "award"),
  },
};
