import { Slider } from "./Slider";
export default {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Single-thumb range control on Base UI Slider with tabular readout and keyboard support (Arrow keys, Home, End, Page Up/Down). Track uses `--kalaa-radius-pill` and the thumb uses `--kalaa-radius-full`.\n\n**Do:** use it for bounded thresholds such as match confidence or batch size. **Don\'t:** use it when an exact arbitrary integer is required; pair with or use an `Input`.\n\n**Usage**\n\n```tsx\nimport { Slider } from "@kalaa/react";\n\n<Slider label="Minimum match confidence" defaultValue={80} min={0} max={100} step={5} />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: {
    label: "Minimum match confidence",
    defaultValue: 80,
    min: 0,
    max: 100,
    step: 5,
    disabled: false,
  },
  argTypes: {
    label: { control: "text" },
    defaultValue: { control: "number" },
    value: { control: false },
    onValueChange: { action: "value changed" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    showValue: { control: "boolean" },
    disabled: { control: "boolean" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {};
export const Disabled = {
  args: { label: "Auto-approve threshold", defaultValue: 95, disabled: true },
};
