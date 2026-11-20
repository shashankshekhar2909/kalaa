import { SkillGroups } from "./SkillGroups";
import { sampleResumeData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Resume/SkillGroups",
  component: SkillGroups,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Categorised skill groups rendered inside a semantic `<dl>` with Kalaa `Badge` items. Supports responsive `"grid"` or narrow `"stacked"` sidebar layouts.\n\n**Do:** group skills into 3–4 clear categories of 4–7 items each. **Don\'t:** assign arbitrary percentage sliders to skills.\n\n**Usage**\n\n```tsx\nimport { SkillGroups } from "@kalaa/react";\n\n<SkillGroups\n  groups={[\n    { category: "Systems & backend", skills: ["Rust", "Go", "TypeScript", "PostgreSQL"] },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    heading: "Skills",
    groups: sampleResumeData.skills,
    layout: "grid",
    headingLevel: 2,
  },
  argTypes: {
    heading: { control: "text" },
    groups: { control: "object" },
    layout: { control: "inline-radio", options: ["grid", "stacked"] },
    headingLevel: { control: "inline-radio", options: [2, 3] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const Stacked = {
  args: {
    layout: "stacked",
  },
};

export const States = {
  args: {
    heading: "Core competencies",
    layout: "stacked",
    groups: [sampleResumeData.skills[0]],
  },
};
