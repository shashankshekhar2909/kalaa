import { PortfolioPage } from "./PortfolioPage";
import { samplePortfolioData } from "../../schemas/sampleData";

export default {
  title: "Templates/PortfolioPage",
  component: PortfolioPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Complete personal portfolio page template driven by a single `PortfolioData` JSON object. Composes `ProfileCard`, `CaseStudyCard`, `ProjectList`, `Timeline`, `SkillGroups`, `TestimonialCard`, `LinkList`, `ContactCard` and `PageFooter` with semantic landmarks.\n\n**Do:** validate incoming JSON with `validatePortfolioData(data)` and keep section anchor IDs aligned with `navigation`. **Don\'t:** skip heading levels between section headers and cards.\n\n**Usage**\n\n```tsx\nimport { PortfolioPage, samplePortfolioData } from "@kalaa/react";\n\n<PortfolioPage data={samplePortfolioData} />\n```',
      },
    },
  },
  args: {
    data: samplePortfolioData,
  },
  argTypes: {
    data: { control: "object" },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    data: {
      ...samplePortfolioData,
      projects: [],
      timeline: [],
      testimonials: [],
      links: [],
    },
  },
};
