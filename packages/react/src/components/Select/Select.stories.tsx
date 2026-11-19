import { Select } from "./Select";

const meta = { title: "Components/Select", component: Select };
export default meta;
export const Default = {
  render: () => (
    <Select
      aria-label="Status"
      options={[
        { value: "draft", label: "Draft" },
        { value: "approved", label: "Approved" },
      ]}
    />
  ),
};
export const States = {
  render: () => (
    <Select
      aria-label="Status"
      options={[
        { value: "draft", label: "Draft" },
        { value: "approved", label: "Approved" },
      ]}
    />
  ),
};
