import type { StorybookConfig } from "@storybook/react-vite";
const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: [
    "../stories/Introduction.mdx",
    "../../../packages/react/src/**/*.stories.tsx",
    "../stories/**/*.stories.tsx",
  ],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  // Logo files and self-hosted fonts are served relative to the Storybook root, so the build works at any base path
  // (/, /storybook/ ...). manager-head.html links the favicon and fonts for the manager UI.
  staticDirs: [
    { from: "../../../brand/assets", to: "/brand" },
    { from: "../../../packages/tokens/dist", to: "/kalaa-tokens" },
  ],
};
export default config;
