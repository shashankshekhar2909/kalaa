import { ResumePage } from "./ResumePage";
import { sampleResumeData } from "../../schemas/sampleData";

export default {
  title: "Templates/ResumePage",
  component: ResumePage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Complete web and print resume template driven by a single `ResumeData` JSON object. Provides `"single-column"` and `"sidebar"` layouts, A4 and US Letter sizing, ATS-linear DOM order and automatic black-on-white print output even in dark mode.\n\n**Do:** validate incoming JSON with `validateResumeData(data)` before rendering. **Don\'t:** reorder DOM landmarks in CSS in a way that breaks screen-reader or ATS reading order.\n\n**Usage**\n\n```tsx\nimport { ResumePage, sampleResumeData } from "@kalaa/react";\n\n<ResumePage data={sampleResumeData} layout="single-column" paperSize="a4" />\n```',
      },
    },
  },
  args: {
    data: sampleResumeData,
    layout: "single-column",
    paperSize: "a4",
    forcePrintPreview: false,
  },
  argTypes: {
    data: { control: "object" },
    layout: { control: "inline-radio", options: ["single-column", "sidebar"] },
    paperSize: { control: "inline-radio", options: ["a4", "letter"] },
    forcePrintPreview: { control: "boolean" },
    className: { control: false },
    ref: { control: false },
  },
};

export const SingleColumn = {
  args: {
    layout: "single-column",
  },
};

export const Sidebar = {
  args: {
    layout: "sidebar",
  },
};

export const States = {
  args: {
    layout: "sidebar",
    paperSize: "letter",
    forcePrintPreview: true,
  },
};
