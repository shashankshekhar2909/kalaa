import { CodeBlock } from "./CodeBlock";

export default {
  title: "Components/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Monospace code with a Copy button. If the clipboard is unavailable it says to select the text and copy it.\n\n**Do:** keep one command or snippet per block. **Don\'t:** expect syntax highlighting; it shows plain text.\n\n**Usage**\n\n```tsx\nimport { CodeBlock } from "@kalaa/react";\n\n<CodeBlock label="Install command" code="pnpm add ./vendor/kalaa-react-0.1.0.tgz" />\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  argTypes: {
    code: { control: "text" },
    label: { control: "text" },
    language: { control: "text" },
    className: { control: false },
  },
};
export const Default = {
  args: {
    label: "Install command",
    code: "pnpm add ./vendor/kalaa-react-0.1.0.tgz ./vendor/kalaa-tokens-0.1.0.tgz",
  },
};
export const Multiline = {
  args: {
    label: "Import styles",
    language: "tsx",
    code: 'import "@kalaa/tokens/fonts.css";\nimport "@kalaa/tokens/tokens.css";\nimport "@kalaa/react/styles.css";',
  },
};
export const States = {
  args: {
    label: "Long command",
    code: "node scripts/css.mjs --check && pnpm --filter @kalaa/react test && pnpm build-storybook && pnpm test:stories",
  },
};
