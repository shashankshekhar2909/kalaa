import type { ComponentPropsWithRef } from "react";
import { cx } from "../../util";
export type SkeletonVariant = "text" | "block" | "circle";
export type SkeletonProps = Omit<ComponentPropsWithRef<"span">, "children"> & {
  /** Shape preset: text line (default), rectangular block, or true circle (avatar placeholder). */
  variant?: SkeletonVariant;
  /** CSS width (number in px or string such as "60%"). */
  width?: number | string;
  /** CSS height (number in px or string). */
  height?: number | string;
};
/** Decorative layout placeholder while content loads; hidden from assistive technology (`aria-hidden="true"`). */
export function Skeleton({ variant = "text", width, height, style, className, ...props }: SkeletonProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      style={{ width, height, ...style }}
      className={cx("kl-skeleton", `kl-skeleton--${variant}`, className)}
    />
  );
}
