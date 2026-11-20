import { MultiSelect } from "./MultiSelect";
const options = [
  { value: "sku", label: "SKU code" },
  { value: "ean", label: "EAN-13 barcode" },
  { value: "title", label: "Product title" },
  { value: "weight", label: "Net weight (g)" },
  { value: "origin", label: "Region of origin" },
  { value: "allergens", label: "Allergen declaration" },
  { value: "shelf_life", label: "Shelf life (days)" },
  { value: "legacy_id", label: "Legacy ERP ID (read-only)", disabled: true },
];
export default {
  title: "Components/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Searchable multi-value picker on Base UI Combobox (`multiple`), rendering selected values as removable chips inside the control. Designed to replace 20-checkbox lists inside table and column-mapping rows.\n\n**Do:** use it when users pick several tags, columns or attributes from a list of 6 or more choices. **Don\'t:** use it for 2–4 checkboxes that fit comfortably inline.\n\n**Usage**\n\n```tsx\nimport { MultiSelect } from "@kalaa/react";\n\n<MultiSelect\n  aria-label="Mapped source columns"\n  options={[\n    { value: "sku", label: "SKU code" },\n    { value: "ean", label: "EAN-13 barcode" },\n    { value: "title", label: "Product title" },\n  ]}\n  defaultValue={["sku", "title"]}\n/>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: {
    "aria-label": "Mapped source columns",
    options,
    defaultValue: ["sku", "title"],
    invalid: false,
    disabled: false,
  },
  argTypes: {
    options: { control: "object" },
    defaultValue: { control: "object" },
    value: { control: false },
    onValueChange: { action: "value changed" },
    placeholder: { control: "text" },
    emptyMessage: { control: "text" },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    "aria-label": { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {};
export const Empty = { args: { defaultValue: [] } };
export const Invalid = { args: { defaultValue: [], invalid: true } };
export const Disabled = { args: { defaultValue: ["sku", "ean"], disabled: true } };
