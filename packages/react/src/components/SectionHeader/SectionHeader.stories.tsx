import { SectionHeader } from "./SectionHeader";

export default {
  title: "Blocks/Marketing/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Consistent section heading (`h2` or `h3`) with an optional `Badge`, muted description and secondary `ButtonLink` action.\n\n**Do:** use sentence case for the heading and keep descriptions under 65 characters per line. **Don\'t:** use ALL-CAPS eyebrow labels.\n\n**Usage**\n\n```tsx\nimport { SectionHeader } from "@kalaa/react";\n\n<SectionHeader\n  title="Engineered for predictable operations"\n  description="Every layer is inspectable, schema-validated and operable from the keyboard."\n/>\n```',
      },
    },
  },
  args: {
    title: "Engineered for predictable operations",
    description: "Every layer is inspectable, schema-validated and operable from the keyboard.",
    badge: "Architecture",
    action: { label: "View documentation", href: "#docs" },
    headingLevel: 2,
    align: "between",
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    badge: { control: "text" },
    action: { control: "object" },
    headingLevel: { control: "inline-radio", options: [2, 3] },
    align: { control: "inline-radio", options: ["between", "start"] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    title: "Selected case studies",
    description: "Deep dives into storage compaction and operator console migrations.",
    badge: undefined,
    action: undefined,
    align: "start",
  },
};
