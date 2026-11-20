import { PageFooter } from "./PageFooter";
import { sampleLandingPageData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Marketing/PageFooter",
  component: PageFooter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Semantic `<footer>` landmark with the Kalaa `LogoMark`, brand tagline, uniquely labelled `<nav>` link columns and utility links.\n\n**Do:** group footer links into 2–3 focused columns with clear headings. **Don\'t:** duplicate identical `aria-label` values across navigation regions.\n\n**Usage**\n\n```tsx\nimport { PageFooter } from "@kalaa/react";\n\n<PageFooter\n  brandName="Pravah Telemetry"\n  tagline="Built with Kalaa design tokens and components."\n  copyright="© 2026 Pravah Telemetry Systems."\n/>\n```',
      },
    },
  },
  args: {
    ...sampleLandingPageData.footer,
  },
  argTypes: {
    brandName: { control: "text" },
    tagline: { control: "text" },
    columns: { control: "object" },
    links: { control: "object" },
    copyright: { control: "text" },
    showLogo: { control: "boolean" },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    brandName: "Aarav Deshmukh",
    tagline: undefined,
    columns: [],
    showLogo: false,
    copyright: "© 2026 Aarav Deshmukh.",
  },
};
