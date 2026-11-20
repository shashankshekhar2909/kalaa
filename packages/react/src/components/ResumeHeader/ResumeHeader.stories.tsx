import { ResumeHeader } from "./ResumeHeader";
import { sampleResumeData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Resume/ResumeHeader",
  component: ResumeHeader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Top identity block for a web or print resume with candidate name (`h1`), professional title, location and contact links.\n\n**Do:** keep contact links scannable and use sentence case for the role title. **Don\'t:** include street addresses or sensitive personal numbers on public resumes.\n\n**Usage**\n\n```tsx\nimport { ResumeHeader } from "@kalaa/react";\n\n<ResumeHeader\n  name="Aarav Deshmukh"\n  title="Principal Systems Architect"\n  location="Pune, India"\n  email="aarav.deshmukh@example.invalid"\n/>\n```',
      },
    },
  },
  args: {
    ...sampleResumeData.basics,
  },
  argTypes: {
    name: { control: "text" },
    title: { control: "text" },
    location: { control: "text" },
    email: { control: "text" },
    phone: { control: "text" },
    website: { control: "text" },
    badge: { control: "text" },
    links: { control: "object" },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    name: "Aarav Deshmukh",
    title: "Principal Systems Architect · Distributed Storage & Operator Tooling",
    location: "Pune, India (UTC+5:30)",
    email: "aarav.deshmukh@example.invalid",
    badge: "Open to advisory roles",
    links: [
      { label: "GitHub", href: "https://github.example.invalid/aarav-deshmukh" },
      { label: "Publications", href: "https://papers.example.invalid/aarav-deshmukh" },
    ],
  },
};
