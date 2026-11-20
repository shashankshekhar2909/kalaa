import { Combobox } from "./Combobox";
const options = [
  { value: "beverages", label: "Beverages & Roasters" },
  { value: "spices", label: "Whole & Ground Spices" },
  { value: "grains", label: "Heirloom Grains & Pulses" },
  { value: "oils", label: "Cold-Pressed Oils" },
  { value: "archived", label: "Seasonal Gift Tins (archived)", disabled: true },
];
export default {
  title: "Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Searchable single-value dropdown built on Base UI Combobox. Filters options as you type and supports full keyboard navigation (Arrow keys, Enter, Escape).\n\n**Do:** use it when a list has more than ~10 options and users know what they are looking for. **Don\'t:** use it for 3–5 fixed options; use `Select` or `RadioGroup`.\n\n**Usage**\n\n```tsx\nimport { Combobox } from "@kalaa/react";\n\n<Combobox\n  aria-label="Catalog category"\n  options={[\n    { value: "beverages", label: "Beverages & Roasters" },\n    { value: "spices", label: "Whole & Ground Spices" },\n  ]}\n  defaultValue="beverages"\n/>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: {
    "aria-label": "Catalog category",
    options,
    size: "md",
    invalid: false,
    disabled: false,
  },
  argTypes: {
    options: { control: "object" },
    defaultValue: { control: "select", options: ["beverages", "spices", "grains", "oils"] },
    value: { control: false },
    onValueChange: { action: "value changed" },
    placeholder: { control: "text" },
    emptyMessage: { control: "text" },
    size: { control: "inline-radio", options: ["sm", "md"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    "aria-label": { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {};
export const Preselected = { args: { defaultValue: "spices" } };
export const Invalid = { args: { invalid: true } };
export const Disabled = { args: { disabled: true, defaultValue: "beverages" } };
