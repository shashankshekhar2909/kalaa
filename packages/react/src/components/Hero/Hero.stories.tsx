import { Hero } from "./Hero";
import { sampleLandingPageData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Marketing/Hero",
  component: Hero,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Top marketing hero block with optional release `Badge`, IBM Plex Serif `h1` headline, value proposition, `ButtonLink` actions (one primary, one secondary) and factual highlights.\n\n**Do:** state what the product does and who it is for in the first sentence. **Don\'t:** use decorative gradients, glows or more than one primary button.\n\n**Usage**\n\n```tsx\nimport { Hero } from "@kalaa/react";\n\n<Hero\n  eyebrow="Release 2.4"\n  title="Calm telemetry for high-voltage operations"\n  description="Ingest, compact and inspect millions of sensor events per second."\n  primaryAction={{ label: "Deploy sample cluster", href: "#cta" }}\n/>\n```',
      },
    },
  },
  args: {
    ...sampleLandingPageData.hero,
    align: "start",
    headingLevel: 1,
  },
  argTypes: {
    eyebrow: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    primaryAction: { control: "object" },
    secondaryAction: { control: "object" },
    highlights: { control: "object" },
    align: { control: "inline-radio", options: ["start", "center"] },
    headingLevel: { control: "inline-radio", options: [1, 2] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const Centered = {
  args: {
    align: "center",
  },
};

export const States = {
  args: {
    eyebrow: undefined,
    highlights: [],
    secondaryAction: undefined,
  },
};
