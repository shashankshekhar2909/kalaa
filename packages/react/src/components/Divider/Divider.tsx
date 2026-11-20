import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
export type DividerOrientation = "horizontal" | "vertical";
export type DividerProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** Axis: horizontal (default) or vertical (for toolbar and inline groups). */
  orientation?: DividerOrientation;
  /** Optional inline text centred on a horizontal divider. */
  label?: ReactNode;
  /** Hides the separator from the accessibility tree (`role="none"`). */
  decorative?: boolean;
};
export function Divider({
  orientation = "horizontal",
  label,
  decorative = false,
  className,
  ...props
}: DividerProps) {
  return (
    <div
      {...props}
      role={decorative ? "none" : "separator"}
      aria-orientation={!decorative && orientation === "vertical" ? "vertical" : undefined}
      className={cx(
        "kl-divider",
        `kl-divider--${orientation}`,
        Boolean(label) && orientation === "horizontal" && "kl-divider--labeled",
        className,
      )}
    >
      {label && orientation === "horizontal" && <span className="kl-divider__label">{label}</span>}
    </div>
  );
}
