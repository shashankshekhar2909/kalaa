import { create } from "storybook/theming";
import { tokens } from "@kalaa/tokens";

// Storybook UI theme built from Kalaa role tokens (Neel, the app default). No colour literals live here: every value
// comes from the generated token JSON, so the manager follows the design system.
const fontBase = "'IBM Plex Sans', 'IBM Plex Sans Devanagari', system-ui, sans-serif";
const fontCode = "'IBM Plex Mono', ui-monospace, monospace";
function theme(mode: "light" | "dark", brandImage: string) {
  const c = tokens.neel[mode];
  return create({
    base: mode,
    colorPrimary: c.accent,
    colorSecondary: c.accent,
    appBg: c.bg,
    appContentBg: c.surface,
    appHoverBg: c["surface-alt"],
    appPreviewBg: c.bg,
    appBorderColor: c.border,
    appBorderRadius: 0,
    fontBase,
    fontCode,
    textColor: c.text,
    textInverseColor: c["on-accent"],
    textMutedColor: c["text-muted"],
    barTextColor: c["text-muted"],
    barHoverColor: c.accent,
    barSelectedColor: c.accent,
    barBg: c.surface,
    buttonBg: c.surface,
    buttonBorder: c["border-strong"],
    booleanBg: c["surface-alt"],
    booleanSelectedBg: c["accent-soft"],
    inputBg: c.surface,
    inputBorder: c["border-strong"],
    inputTextColor: c.text,
    inputBorderRadius: 0,
    brandTitle: "Kalaa",
    brandUrl: "./",
    brandImage,
    brandTarget: "_self",
  });
}
export const kalaaLight = theme("light", "./brand/logo-wordmark.svg");
export const kalaaDark = theme("dark", "./brand/logo-wordmark-dark.svg");
export const kalaaTheme = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches
    ? kalaaDark
    : kalaaLight;
