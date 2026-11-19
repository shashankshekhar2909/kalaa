import { Banner } from "./Banner";

export default {
  title: "Components/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Inline message in one of four tones; `warning` and `danger` are announced as alerts.\n\n**Do:** state the problem and the fix. **Don\'t:** use it for transient confirmations or stack several in one area.\n\n**Usage**\n\n```tsx\nimport { Banner } from "@kalaa/react";\n\n<Banner tone="warning" title="1 field needs attention">Fix the price before approving.</Banner>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  argTypes: {
    tone: { control: "select", options: ["info", "success", "warning", "danger"] },
    title: { control: "text" },
    children: { control: "text" },
    actions: { control: false },
    className: { control: false },
    ref: { control: false },
  },
};
export const Info = {
  args: { tone: "info", title: "Import started", children: "Products are being imported." },
};
export const Success = { args: { tone: "success", children: "Products imported." } };
export const Warning = { args: { tone: "warning", children: "Some products need review." } };
export const Danger = { args: { tone: "danger", children: "The import failed." } };
export const States = {
  args: {
    tone: "warning",
    title: "Review required",
    children:
      "Some products have a long description that requires your attention before they can be published.",
  },
};
