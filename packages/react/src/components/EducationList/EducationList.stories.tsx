import { EducationList } from "./EducationList";
import { sampleResumeData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Resume/EducationList",
  component: EducationList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Academic qualifications block showing degrees, institutions, graduation `<time>` dates, thesis notes and honours badges.\n\n**Do:** keep coursework notes brief and factual. **Don\'t:** include secondary school entries once university credentials are listed.\n\n**Usage**\n\n```tsx\nimport { EducationList } from "@kalaa/react";\n\n<EducationList\n  items={[\n    {\n      degree: "M.Tech in Computer Science and Engineering",\n      institution: "Visvesvaraya Institute of Technology",\n      startDate: "2014",\n      endDate: "2016",\n      honors: ["Institute Gold Medal"],\n    },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    heading: "Education",
    items: sampleResumeData.education,
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
    heading: "Education",
    items: [sampleResumeData.education[1]],
  },
};
