import { tokens, type Accent, type Mode, type Role } from "@kalaa/tokens";

function luminance(hex: string) {
  const [r, g, b] = (hex.slice(1).match(/../g) ?? []).map((x) => {
    const c = parseInt(x, 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** WCAG contrast ratio of two roles for an accent and mode, from the generated token JSON (not hand-typed). */
export function ratio(accent: Accent, mode: Mode, a: Role, b: Role) {
  const [x, y] = [luminance(tokens[accent][mode][a]), luminance(tokens[accent][mode][b])];
  return ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2);
}
