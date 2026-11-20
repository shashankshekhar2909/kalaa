import type { Preview } from "@storybook/react-vite";
import "@kalaa/tokens/fonts.css";
import "@kalaa/tokens/tokens.css";
import "../stories/foundations.css";
import { kalaaTheme } from "./kalaa-theme";
// Component CSS straight from source (the published package ships the same files joined as styles.css).
import.meta.glob("../../../packages/react/src/components/*/*.css", {
  eager: true,
});
const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Colour scheme",
      toolbar: {
        title: "Theme",
        icon: "contrast",
        items: [
          { value: "system", title: "System" },
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
    accent: {
      description: "Accent colour",
      toolbar: {
        title: "Accent",
        icon: "paintbrush",
        items: [
          { value: "neel", title: "Neel (indigo)" },
          { value: "geru", title: "Geru (red ochre)" },
          { value: "mayur", title: "Mayur (peacock teal)" },
        ],
        dynamicTitle: true,
      },
    },
    shape: {
      description: "Corner shape",
      toolbar: {
        title: "Shape",
        icon: "box",
        items: [
          { value: "square", title: "Square (default)" },
          { value: "soft", title: "Soft" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "system", accent: "neel", shape: "square" },
  decorators: [
    (Story, context) => {
      const root = document.documentElement;
      if (context.globals.theme === "system") root.removeAttribute("data-theme");
      else root.dataset.theme = context.globals.theme;
      if (context.globals.accent === "neel") root.removeAttribute("data-accent");
      else root.dataset.accent = context.globals.accent;
      if (context.globals.shape === "soft") root.dataset.shape = "soft";
      else root.removeAttribute("data-shape");
      return <Story />;
    },
  ],
  parameters: {
    a11y: { test: "error" },
    backgrounds: { disable: true },
    layout: "fullscreen",
    docs: { theme: kalaaTheme(), toc: true },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          ["Logo", "Colour", "Typography", "Shape", "Space", "Palette"],
          "Components",
          [
            // Layout
            "AppShell",
            "PageHeader",
            "Card",
            "KeyValue",
            "ValueComparison",
            "EmptyState",
            // Actions
            "Button",
            "ButtonLink",
            // Forms
            "Field",
            "Input",
            "Textarea",
            "Select",
            "Checkbox",
            "Switch",
            // Navigation
            "Tabs",
            // Feedback
            "Banner",
            "Badge",
            "StatusBadge",
            "ProgressBar",
            // Overlays
            "Dialog",
            // Content
            "Logo",
            "CodeBlock",
          ],
          "Examples",
        ],
      },
    },
  },
};
export default preview;
