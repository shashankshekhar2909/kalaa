import { ContactCard } from "./ContactCard";
import { samplePortfolioData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Profile & portfolio/ContactCard",
  component: ContactCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Direct contact card built on Kalaa `Card`, `KeyValue`, `Badge` and `ButtonLink` with email, location, response time and a primary `mailto:` action.\n\n**Do:** state expected response times and timezone clearly. **Don\'t:** hide the email address behind a copy-only button.\n\n**Usage**\n\n```tsx\nimport { ContactCard } from "@kalaa/react";\n\n<ContactCard\n  title="Start a technical conversation"\n  email="aarav.deshmukh@example.invalid"\n  location="Pune, India"\n  responseTime="Within 1 business day"\n/>\n```',
      },
    },
  },
  args: {
    ...samplePortfolioData.contact,
    headingLevel: 2,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    email: { control: "text" },
    phone: { control: "text" },
    location: { control: "text" },
    availability: { control: "text" },
    responseTime: { control: "text" },
    ctaLabel: { control: "text" },
    links: { control: "object" },
    headingLevel: { control: "inline-radio", options: [2, 3, 4] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    title: "Get in touch",
    email: "aarav.deshmukh@example.invalid",
    description: undefined,
    phone: undefined,
    availability: undefined,
    links: [],
  },
};
