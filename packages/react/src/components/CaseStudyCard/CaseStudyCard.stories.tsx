import { CaseStudyCard } from "./CaseStudyCard";
import { samplePortfolioData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Profile & portfolio/CaseStudyCard",
  component: CaseStudyCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Portfolio case study card built on Kalaa `Card`, `KeyValue`, `Badge` and `ButtonLink` with structured Challenge/Outcome rows and `<time>` year.\n\n**Do:** pair every challenge with a measurable outcome and give the CTA link a specific accessible label. **Don\'t:** use vague "Learn more" link text when multiple case studies appear on one page.\n\n**Usage**\n\n```tsx\nimport { CaseStudyCard } from "@kalaa/react";\n\n<CaseStudyCard\n  title="Substation telemetry pipeline overhaul"\n  client="Vayu Grid Systems"\n  year="2025"\n  summary="Replaced a polling collector with a bounded-memory Rust stream compactor."\n  metrics={[{ label: "Recovery time", value: "22 s" }]}\n/>\n```',
      },
    },
  },
  args: {
    ...samplePortfolioData.caseStudies[0],
    headingLevel: 2,
  },
  argTypes: {
    title: { control: "text" },
    client: { control: "text" },
    year: { control: "text" },
    summary: { control: "text" },
    challenge: { control: "text" },
    outcome: { control: "text" },
    metrics: { control: "object" },
    tags: { control: "object" },
    href: { control: "text" },
    ctaLabel: { control: "text" },
    headingLevel: { control: "inline-radio", options: [2, 3, 4] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    ...samplePortfolioData.caseStudies[1],
    challenge: undefined,
    outcome: undefined,
    href: undefined,
  },
};
