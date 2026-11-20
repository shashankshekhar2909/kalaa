import { ExperienceItem, ExperienceList } from "./ExperienceList";
import { sampleResumeData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Resume/ExperienceList",
  component: ExperienceList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Chronological work history block composed of `ExperienceItem` entries with role, organisation, semantic `<time>` dates, outcome bullets and technology `Badge` tags.\n\n**Do:** start each bullet with a concrete verb and quantify the outcome. **Don\'t:** list more than 4–5 bullets per role.\n\n**Usage**\n\n```tsx\nimport { ExperienceList } from "@kalaa/react";\n\n<ExperienceList\n  items={[\n    {\n      role: "Principal Systems Architect",\n      org: "Vayu Grid Systems",\n      startDate: "2023-04",\n      endDate: "Present",\n      bullets: ["Sustained 1.4M events/s at p99 latency under 18 ms."],\n      tags: ["Rust", "Go", "TypeScript"],\n    },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    heading: "Experience",
    items: sampleResumeData.experience,
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

export const SingleItem = {
  render: () => <ExperienceItem {...sampleResumeData.experience[0]} headingLevel={2} />,
};

export const States = {
  args: {
    heading: "Work experience",
    items: [sampleResumeData.experience[2]],
  },
};
