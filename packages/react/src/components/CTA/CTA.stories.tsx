import { CTA } from "./CTA";
import { sampleLandingPageData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Marketing/CTA",
  component: CTA,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Call-to-action card with a 3px accent start border, serif heading, description, optional note and `ButtonLink` actions.\n\n**Do:** use a verb phrase for `primaryAction.label` ("Download evaluation tarball"). **Don\'t:** include more than one primary button.\n\n**Usage**\n\n```tsx\nimport { CTA } from "@kalaa/react";\n\n<CTA\n  title="Ready to calm your telemetry stack?"\n  description="Run the self-contained simulator locally."\n  primaryAction={{ label: "Download evaluation tarball", href: "#download" }}\n/>\n```',
      },
    },
  },
  args: {
    ...sampleLandingPageData.cta,
    headingLevel: 2,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    primaryAction: { control: "object" },
    secondaryAction: { control: "object" },
    note: { control: "text" },
    headingLevel: { control: "inline-radio", options: [2, 3] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    title: "Need an architecture audit?",
    description: undefined,
    note: undefined,
    secondaryAction: undefined,
  },
};
