import { FeatureGrid } from "./FeatureGrid";
import { sampleLandingPageData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Marketing/FeatureGrid",
  component: FeatureGrid,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Responsive 2- or 3-column grid of product capabilities built from `SectionHeader`, Kalaa `Card` and `Badge`.\n\n**Do:** keep feature titles specific and give each link a distinct accessible label. **Don\'t:** nest cards inside feature cards.\n\n**Usage**\n\n```tsx\nimport { FeatureGrid } from "@kalaa/react";\n\n<FeatureGrid\n  heading="Engineered for predictable operations"\n  features={[\n    {\n      title: "Bounded-memory stream compactor",\n      description: "Fixed ring buffers guarantee zero out-of-memory restarts.",\n      badge: "Storage",\n    },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    heading: sampleLandingPageData.features.heading,
    description: sampleLandingPageData.features.description,
    features: sampleLandingPageData.features.items,
    columns: 3,
    headingLevel: 2,
  },
  argTypes: {
    heading: { control: "text" },
    description: { control: "text" },
    features: { control: "object" },
    columns: { control: "inline-radio", options: [2, 3] },
    headingLevel: { control: "inline-radio", options: [2, 3] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const TwoColumns = {
  args: {
    columns: 2,
    features: sampleLandingPageData.features.items.slice(0, 2),
  },
};

export const States = {
  args: {
    heading: undefined,
    description: undefined,
    features: sampleLandingPageData.features.items.map(({ href: _h, linkLabel: _l, ...rest }) => rest),
  },
};
