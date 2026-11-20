import { Certifications } from "./Certifications";
import { sampleResumeData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Resume/Certifications",
  component: Certifications,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Professional certifications block with issuer name, `<time>` dates, optional verification link and credential ID `Badge`.\n\n**Do:** include active, verifiable industry certifications. **Don\'t:** list short attendance certificates without an assessment.\n\n**Usage**\n\n```tsx\nimport { Certifications } from "@kalaa/react";\n\n<Certifications\n  items={[\n    {\n      name: "Certified Kubernetes Security Specialist (CKS)",\n      issuer: "Cloud Native Computing Foundation",\n      date: "2024-02",\n      credentialId: "CNCF-CKS-884120",\n    },\n  ]}\n/>\n```',
      },
    },
  },
  args: {
    heading: "Certifications",
    items: sampleResumeData.certifications ?? [],
    headingLevel: 2,
  },
  argTypes: {
    heading: { control: "text" },
    items: { control: "object" },
    headingLevel: { control: "inline-radio", options: [2, 3] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    items: [
      {
        name: "IAAP Certified Professional in Web Accessibility (CPWA)",
        issuer: "International Association of Accessibility Professionals",
        date: "2023-09",
        href: "https://verify.example.invalid/cpwa-30941",
      },
    ],
  },
};
