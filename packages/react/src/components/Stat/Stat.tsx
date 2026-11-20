import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
export type StatDeltaTone = "neutral" | "success" | "warning" | "danger";
export type StatProps = ComponentPropsWithRef<"div"> & {
  /** Metric name in sentence case (for example "Products pending review"). */
  label: ReactNode;
  /** Primary figure, rendered in tabular numerals. */
  value: ReactNode;
  /** Optional change indicator (for example "+14%" or "-3 rows"). */
  delta?: ReactNode;
  /** Meaning of the delta badge: neutral (default), success, warning or danger. */
  deltaTone?: StatDeltaTone;
  /** Secondary context or comparison period below the value. */
  help?: ReactNode;
};
export function Stat({ label, value, delta, deltaTone = "neutral", help, className, ...props }: StatProps) {
  return (
    <div {...props} className={cx("kl-stat", className)}>
      <div className="kl-stat__label">{label}</div>
      <div className="kl-stat__row">
        <div className="kl-stat__value">{value}</div>
        {delta !== undefined && delta !== null && (
          <span className={cx("kl-stat__delta", `kl-stat__delta--${deltaTone}`)}>{delta}</span>
        )}
      </div>
      {help && <div className="kl-stat__help">{help}</div>}
    </div>
  );
}
