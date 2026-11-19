import type { Preview } from "@storybook/react-vite";
import "@kalaa/tokens/fonts.css";
import "@kalaa/tokens/tokens.css";
import "../stories/foundations.css";
// Component CSS straight from source (the published package ships the same files joined as styles.css).
import.meta.glob("../../../packages/react/src/components/*/*.css", { eager: true });
const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Colour scheme",
      toolbar: { title: "Theme", items: ["system", "light", "dark"], dynamicTitle: true },
    },
    accent: {
      description: "Accent colour",
      toolbar: { title: "Accent", items: ["neel", "geru", "mayur"], dynamicTitle: true },
    },
    shape: {
      description: "Corner shape",
      toolbar: { title: "Shape", items: ["square", "soft"], dynamicTitle: true },
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
  parameters: { a11y: { test: "error" }, backgrounds: { disable: true }, layout: "fullscreen" },
};
export default preview;
