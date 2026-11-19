import { KeyValue } from "./KeyValue";

export default {
  title: "Components/KeyValue",
  component: KeyValue,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Definition list for facts about one thing. `rows` has a label column and dividers; `grid` fits summaries.\n\n**Do:** let an empty value show as an em dash (automatic). **Don\'t:** use it for many records; a Table is planned for v0.2.\n\n**Usage**\n\n```tsx\nimport { KeyValue } from "@kalaa/react";\n\n<KeyValue items={[{ label: "Status", value: "Draft" }, { label: "Stock", value: "88 units" }]} />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { layout: "rows" },
  argTypes: {
    items: { control: "object" },
    layout: { control: "inline-radio", options: ["rows", "grid"] },
    className: { control: false },
    ref: { control: false },
  },
};
export const Rows = {
  args: {
    items: [
      { label: "Status", value: "Draft" },
      { label: "Products", value: 24 },
    ],
  },
};
export const Grid = {
  args: {
    layout: "grid",
    items: [
      { label: "Status", value: "Imported" },
      { label: "Products", value: 24 },
    ],
  },
};
export const States = {
  args: {
    items: [
      { label: "Description", value: "" },
      { label: "Collection", value: "A long collection name requiring review" },
    ],
  },
};
