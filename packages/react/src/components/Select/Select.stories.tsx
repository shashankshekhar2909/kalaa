import { Select } from "./Select";
const meta = { title: "Components/Select", component: Select };
export default meta;
const options = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "Needs review" },
  { value: "archived", label: "Archived", disabled: true },
  { value: "long", label: "Approved for publication in all catalog collections" },
];
export const Default = { render: () => <Select aria-label="Review status" options={options} /> };
export const Small = { render: () => <Select aria-label="Review status" options={options} size="sm" /> };
export const Placeholder = {
  render: () => <Select aria-label="Review status" options={options} placeholder="Choose a review status" />,
};
export const Disabled = { render: () => <Select aria-label="Review status" options={options} disabled /> };
export const Invalid = { render: () => <Select aria-label="Review status" options={options} invalid /> };
export const LongValue = {
  render: () => <Select aria-label="Review status" options={options} defaultValue="long" />,
};
export const PreselectedWithDisabledOption = {
  render: () => <Select aria-label="Review status" options={options} defaultValue="review" />,
};
