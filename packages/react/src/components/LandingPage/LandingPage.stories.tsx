import { LandingPage } from "./LandingPage";
import { sampleLandingPageData } from "../../schemas/sampleData";

export default {
  title: "Templates/LandingPage",
  component: LandingPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Complete product and marketing landing page template driven by a single `LandingPageData` JSON object. Composes `Hero`, `StatsBand`, `FeatureGrid`, `TestimonialCard`, `FAQ`, `CTA` and `PageFooter` with accessible landmarks.\n\n**Do:** keep the hero `h1` focused on a concrete operational outcome. **Don\'t:** add client-only carousels that fail without JavaScript.\n\n**Usage**\n\n```tsx\nimport { LandingPage, sampleLandingPageData } from "@kalaa/react";\n\n<LandingPage data={sampleLandingPageData} />\n```',
      },
    },
  },
  args: {
    data: sampleLandingPageData,
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
      ...sampleLandingPageData,
      stats: undefined,
      testimonials: undefined,
      faq: undefined,
    },
  },
};
