import { Summary } from "./Summary";
import { sampleResumeData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Resume/Summary",
  component: Summary,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Executive summary block with a section heading, concise narrative paragraph and optional bulleted highlights.\n\n**Do:** state domain focus, years of practice and measurable outcomes in 2–3 sentences. **Don\'t:** write generic buzzwords without concrete scope.\n\n**Usage**\n\n```tsx\nimport { Summary } from "@kalaa/react";\n\n<Summary\n  text="Systems architect with 11 years designing deterministic telemetry pipelines."\n  highlights={["Cut regional failover recovery from 14 minutes to 22 seconds"]}\n/>\n```',
      },
    },
  },
  args: {
    heading: "Summary",
    text: sampleResumeData.summary.text,
    highlights: sampleResumeData.summary.highlights,
    headingLevel: 2,
  },
  argTypes: {
    heading: { control: "text" },
    text: { control: "text" },
    highlights: { control: "object" },
    headingLevel: { control: "inline-radio", options: [2, 3] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    heading: "Profile summary",
    text: "Staff engineer focused on schema-driven data ingestion and accessible operational tools.",
    highlights: [],
  },
};
