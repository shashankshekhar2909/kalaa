import { Languages } from "./Languages";
import { sampleResumeData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Resume/Languages",
  component: Languages,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Spoken and written languages block pairing each language name with a proficiency `Badge`.\n\n**Do:** use standard proficiency descriptions (Native, Full professional, Working proficiency). **Don\'t:** use flag emojis to represent languages.\n\n**Usage**\n\n```tsx\nimport { Languages } from "@kalaa/react";\n\n<Languages\n  items={[\n    { language: "Marathi", proficiency: "Native or bilingual", level: "native" },\n    { language: "English", proficiency: "Full professional proficiency", level: "fluent" },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    heading: "Languages",
    items: sampleResumeData.languages ?? [],
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
    items: [
      { language: "Hindi", proficiency: "Full professional proficiency", level: "fluent" },
      { language: "German", proficiency: "Elementary proficiency", level: "elementary" },
    ],
  },
};
