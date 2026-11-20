import type { ComponentPropsWithRef } from "react";
import { cx } from "../../util";
/**
 * The icon set: SVG path data on a 24 x 24 grid, drawn with a 1.75 stroke, round caps and joins, no fill.
 * To add an icon, add one entry here (a `d` string, or several joined by a space); its name becomes part of
 * `IconName` automatically. Draw with `currentColor` only: never put a colour in a path.
 */
export const iconPaths = {
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  check: "M5 12.5l4.5 4.5L19 7.5",
  close: "M6 6l12 12M18 6L6 18",
  search: "M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM20 20l-4.2-4.2",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-up": "M6 15l6-6 6 6",
  "chevron-left": "M15 6l-6 6 6 6",
  "chevron-right": "M9 6l6 6-6 6",
  "arrow-left": "M19 12H5M11 6l-6 6 6 6",
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  "external-link": "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  upload: "M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
  download: "M12 4v12M7 11l5 5 5-5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3",
  edit: "M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4",
  copy: "M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1zM16 9V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3",
  filter: "M4 5h16l-6 8v6l-4-2v-4L4 5z",
  settings: "M4 7h10M18 7h2M4 17h2M10 17h10M16 4v6M8 14v6",
  info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8h.01",
  warning: "M12 4l9 16H3L12 4zM12 10v4M12 17h.01",
  error: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 9l6 6M15 9l-6 6",
  success: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12.5l3 3 5-6",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  "log-out": "M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5M15 8l4 4-4 4M19 12H9",
  refresh: "M20 11a8 8 0 0 0-14-4M4 4v4h4M4 13a8 8 0 0 0 14 4M20 20v-4h-4",
} as const;
export type IconName = keyof typeof iconPaths;
/** Every available icon name, in declaration order. */
export const iconNames = Object.keys(iconPaths) as IconName[];
export type IconSize = "sm" | "md" | "lg";
export type IconProps = Omit<ComponentPropsWithRef<"svg">, "children"> & {
  /** Which icon to draw. */
  name: IconName;
  /** Size: sm 16px, md 20px (default), lg 24px. */
  size?: IconSize;
  /** Accessible name for an icon that stands alone. Omit it for decorative icons next to text (they are hidden from screen readers). */
  label?: string;
};
export function Icon({ name, size = "md", label, className, ...props }: IconProps) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cx("kl-icon", `kl-icon--${size}`, className)}
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
