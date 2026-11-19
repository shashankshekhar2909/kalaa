import { Checkbox } from "./Checkbox";
const meta = { title: "Components/Checkbox", component: Checkbox };
export default meta;
export const Unchecked = { render: () => <Checkbox label="Include archived products" /> };
export const Checked = { render: () => <Checkbox label="Include archived products" defaultChecked /> };
export const Indeterminate = { render: () => <Checkbox label="Select all products" indeterminate /> };
export const WithDescription = {
  render: () => (
    <Checkbox label="Include archived products" description="Apply this setting to the catalog." />
  ),
};
export const DisabledUnchecked = { render: () => <Checkbox label="Include archived products" disabled /> };
export const DisabledChecked = {
  render: () => <Checkbox label="Include archived products" disabled defaultChecked />,
};
