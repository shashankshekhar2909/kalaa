import { TestimonialCard } from "./TestimonialCard";
import { samplePortfolioData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Profile & portfolio/TestimonialCard",
  component: TestimonialCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Endorsement card built on Kalaa `Card` (`as="article"`) with a semantic `<blockquote>`, `<cite>` author attribution, role, organisation and `<time>` date.\n\n**Do:** attribute every quote to a named role and project context. **Don\'t:** include star-rating widgets or unverified anonymous quotes.\n\n**Usage**\n\n```tsx\nimport { TestimonialCard } from "@kalaa/react";\n\n<TestimonialCard\n  quote="Aarav turned our most fragile telemetry service into the calmest part of our stack."\n  author="Meera Kulkarni"\n  role="VP of Engineering"\n  org="Vayu Grid Systems"\n/>\n```',
      },
    },
  },
  args: {
    ...(samplePortfolioData.testimonials?.[0] ?? {
      quote: "Aarav turned our most fragile telemetry service into the calmest part of our stack.",
      author: "Meera Kulkarni",
      role: "VP of Engineering",
    }),
  },
  argTypes: {
    quote: { control: "text" },
    author: { control: "text" },
    role: { control: "text" },
    org: { control: "text" },
    date: { control: "text" },
    context: { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    quote:
      "His schema gateway caught every breaking change before staging while keeping build checks under four seconds.",
    author: "Rohan Verma",
    role: "Director of Platform Reliability",
    org: "Narmada Cloud Labs",
    date: undefined,
    context: undefined,
  },
};
