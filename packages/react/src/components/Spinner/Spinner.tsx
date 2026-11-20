import type { ComponentPropsWithRef } from "react";
import { cx } from "../../util";
export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerProps = Omit<ComponentPropsWithRef<"span">, "children"> & {
  /** Diameter: sm 12px, md 16px (default), lg 24px. */
  size?: SpinnerSize;
  /** Accessible text announced to screen readers (`role="status"`). Ignored when `decorative`. */
  label?: string;
  /** Hides the spinner from assistive tech; use when the surrounding control already says it is busy. */
  decorative?: boolean;
};
export function Spinner({
  size = "md",
  label = "Loading",
  decorative = false,
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      {...props}
      role={decorative ? undefined : "status"}
      aria-hidden={decorative || undefined}
      className={cx("kl-spinner", `kl-spinner--${size}`, className)}
    >
      {!decorative && <span className="kl-spinner__label">{label}</span>}
    </span>
  );
}
