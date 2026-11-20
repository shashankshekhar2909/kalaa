import { RadioGroup } from "./RadioGroup";
const options = [
  {
    value: "merge",
    label: "Merge with existing products",
    description: "Updates matching SKUs and appends new records.",
  },
  {
    value: "append",
    label: "Insert new products only",
    description: "Skips rows whose SKU is already in the catalog.",
  },
  {
    value: "replace",
    label: "Replace entire collection",
    description: "Disabled while a review batch is open.",
    disabled: true,
  },
];
export default {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Mutually exclusive choice list built on Base UI RadioGroup, with arrow-key roving focus and optional per-option descriptions. Always uses `--kalaa-radius-full` so radio buttons remain circular in both square and soft shape themes.\n\n**Do:** use it for two to five mutually exclusive options that benefit from being visible at once. **Don\'t:** use it for more than five options; use `Select` or `Combobox`.\n\n**Usage**\n\n```tsx\nimport { RadioGroup } from "@kalaa/react";\n\n<RadioGroup\n  aria-label="Import mode"\n  defaultValue="merge"\n  options={[\n    { value: "merge", label: "Merge with existing products" },\n    { value: "append", label: "Insert new products only" },\n  ]}\n/>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: {
    "aria-label": "Import mode",
    options,
    defaultValue: "merge",
    orientation: "vertical",
    disabled: false,
  },
  argTypes: {
    options: { control: "object" },
    defaultValue: { control: "select", options: ["merge", "append", "replace"] },
    value: { control: false },
    onValueChange: { action: "value changed" },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text" },
    "aria-label": { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {};
export const Horizontal = {
  args: {
    "aria-label": "Row density",
    orientation: "horizontal",
    defaultValue: "comfortable",
    options: [
      { value: "comfortable", label: "Comfortable" },
      { value: "compact", label: "Compact" },
    ],
  },
};
export const Disabled = { args: { disabled: true } };
