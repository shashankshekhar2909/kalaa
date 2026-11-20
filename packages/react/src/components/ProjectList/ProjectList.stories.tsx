import { ProjectCard, ProjectList } from "./ProjectList";
import { sampleResumeData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Resume/ProjectList",
  component: ProjectList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Grid or stack of `ProjectCard` blocks built on Kalaa `Card`, `KeyValue` and `Badge` with impact numbers, technology tags and links.\n\n**Do:** highlight 1–2 concrete impact metrics per project. **Don\'t:** crowd cards with more than 3 links.\n\n**Usage**\n\n```tsx\nimport { ProjectList } from "@kalaa/react";\n\n<ProjectList\n  items={[\n    {\n      name: "Pravah Stream Compactor",\n      description: "Time-series segment compactor for edge gateways.",\n      impact: [{ label: "Write amplification", value: "1.18x (-54%)" }],\n      tags: ["Rust", "Storage"],\n      links: [{ label: "Source", href: "https://github.example.invalid/vayu-grid/pravah" }],\n    },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    heading: "Projects",
    items: sampleResumeData.projects ?? [],
    columns: 2,
    headingLevel: 2,
  },
  argTypes: {
    heading: { control: "text" },
    items: { control: "object" },
    columns: { control: "inline-radio", options: [1, 2] },
    headingLevel: { control: "inline-radio", options: [2, 3] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const SingleCard = {
  render: () => (
    <ProjectCard
      {...(sampleResumeData.projects?.[0] ?? { name: "Sample", description: "Desc" })}
      headingLevel={2}
    />
  ),
};

export const States = {
  args: {
    columns: 1,
    items: sampleResumeData.projects ? [sampleResumeData.projects[0]] : [],
  },
};
