import { Switch } from "./Switch";
const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'On/off setting that applies immediately, with a label and optional description.\n\n**Do:** use it for settings. **Don\'t:** use it in a form that needs a Save step; use a Checkbox.\n\n**Usage**\n\n```tsx\nimport { Switch } from "@kalaa/react";\n\n<Switch label="Track stock" description="Warn when fewer than 20 units are left." />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: { disabled: false },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text" },
    onCheckedChange: { action: "checked changed" },
    className: { control: false },
    ref: { control: false },
  },
};
export default meta;
export const Unchecked = { args: { label: "Enable imports" } };
export const Checked = { render: () => <Switch label="Enable imports" defaultChecked /> };
export const WithDescription = {
  render: () => <Switch label="Enable imports" description="Apply this setting to the catalog." />,
};
export const DisabledUnchecked = { render: () => <Switch label="Enable imports" disabled /> };
export const DisabledChecked = { render: () => <Switch label="Enable imports" disabled defaultChecked /> };
