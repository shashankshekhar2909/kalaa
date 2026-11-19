import { Switch } from "./Switch";
const meta = { title: "Components/Switch", component: Switch };
export default meta;
export const Unchecked = { render: () => <Switch label="Enable imports" /> };
export const Checked = { render: () => <Switch label="Enable imports" defaultChecked /> };
export const WithDescription = {
  render: () => <Switch label="Enable imports" description="Apply this setting to the catalog." />,
};
export const DisabledUnchecked = { render: () => <Switch label="Enable imports" disabled /> };
export const DisabledChecked = { render: () => <Switch label="Enable imports" disabled defaultChecked /> };
