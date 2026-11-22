import { AppearanceMenu } from "./AppearanceMenu";

export default {
  title: "Components/AppearanceMenu",
  component: AppearanceMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Anchored appearance picker built from Kalaa `Popover` and `RadioGroup` for switching theme (`auto`, `light`, `dark`), accent colour (`neel`, `geru`, `mayur`) and corners (`square`, `soft`). Persists under the `"kalaa.theme"` `localStorage` key and syncs across tabs and `<kalaa-theme-picker>`.\n\n**Do:** place it in the application header or sidebar footer so users can adjust theme, accent and corner shape at any time. **Don\'t:** build per-app theme toggles with custom storage keys; share `"kalaa.theme"` so every Kalaa app respects the user\'s choice.\n\n**Usage**\n\n```tsx\nimport { AppearanceMenu } from "@kalaa/react";\n\n<AppearanceMenu />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: {
    label: "Appearance",
    side: "bottom",
    align: "start",
    defaultOpen: true,
    triggerVariant: "ghost",
    triggerSize: "sm",
  },
  argTypes: {
    label: { control: "text" },
    side: { control: "inline-radio", options: ["top", "bottom", "left", "right"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    open: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    onOpenChange: { action: "open changed" },
    triggerVariant: {
      control: "inline-radio",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    triggerSize: { control: "inline-radio", options: ["sm", "md"] },
    onAppearanceChange: { action: "appearance changed" },
    className: { control: false },
    ref: { control: false },
  },
};

export const Default = {};

export const Closed = {
  args: {
    defaultOpen: false,
  },
};
