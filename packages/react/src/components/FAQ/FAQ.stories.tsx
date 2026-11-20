import { FAQ } from "./FAQ";
import { sampleLandingPageData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Marketing/FAQ",
  component: FAQ,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Frequently asked questions block built on native HTML `<details>` and `<summary>` elements so disclosures work without client-side JavaScript.\n\n**Do:** write questions from the reader\'s perspective and open the first item or all items for print. **Don\'t:** hide critical pricing or security warnings inside collapsed disclosures.\n\n**Usage**\n\n```tsx\nimport { FAQ } from "@kalaa/react";\n\n<FAQ\n  items={[\n    {\n      question: "Does the operator console work without client-side JavaScript?",\n      answer: "Yes. Every report and disclosure renders valid semantic HTML on the server.",\n    },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    heading: sampleLandingPageData.faq?.heading ?? "Frequently asked questions",
    description: sampleLandingPageData.faq?.description,
    items: sampleLandingPageData.faq?.items ?? [],
    defaultOpenAll: false,
    headingLevel: 2,
  },
  argTypes: {
    heading: { control: "text" },
    description: { control: "text" },
    items: { control: "object" },
    defaultOpenAll: { control: "boolean" },
    headingLevel: { control: "inline-radio", options: [2, 3] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    defaultOpenAll: true,
  },
};
