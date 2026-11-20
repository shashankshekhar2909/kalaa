import { ProfileCard } from "./ProfileCard";
import { samplePortfolioData } from "../../schemas/sampleData";

export default {
  title: "Blocks/Profile & portfolio/ProfileCard",
  component: ProfileCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Personal identity and bio card with monogram avatar, availability `Badge`, tabular-figure stats, skill tags and `ButtonLink` actions (at most one primary).\n\n**Do:** use concise, verifiable numbers in `stats` and keep the bio under 3 sentences. **Don\'t:** place two primary buttons in the action row.\n\n**Usage**\n\n```tsx\nimport { ProfileCard } from "@kalaa/react";\n\n<ProfileCard\n  name="Aarav Deshmukh"\n  role="Principal Systems Architect"\n  bio="I design high-throughput telemetry engines and calm operator consoles."\n  availability="Available for Q1 reviews"\n/>\n```',
      },
    },
  },
  args: {
    ...samplePortfolioData.profile,
    headingLevel: 2,
  },
  argTypes: {
    name: { control: "text" },
    role: { control: "text" },
    location: { control: "text" },
    bio: { control: "text" },
    availability: { control: "text" },
    initials: { control: "text" },
    skills: { control: "object" },
    stats: { control: "object" },
    primaryAction: { control: "object" },
    secondaryAction: { control: "object" },
    headingLevel: { control: "inline-radio", options: [2, 3] },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const States = {
  args: {
    name: "Aarav Deshmukh",
    role: "Principal Systems Architect",
    bio: "Focused on deterministic storage compaction and accessible operational interfaces.",
    availability: undefined,
    stats: [],
    primaryAction: { label: "Email Aarav", href: "mailto:aarav.deshmukh@example.invalid" },
    secondaryAction: undefined,
  },
};
