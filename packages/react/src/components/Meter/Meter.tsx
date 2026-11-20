import type { ComponentPropsWithRef } from "react";
import { cx } from "../../util";

export type MeterProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  label: string;
  /** Score from 0 to 100. A missing or invalid score is shown as unavailable. */
  value?: number | null;
  unavailableLabel?: string;
};

export function Meter({ label, value, unavailableLabel = "Unavailable", className, ...props }: MeterProps) {
  const available = typeof value === "number" && value >= 0 && value <= 100;
  return (
    <div {...props} className={cx("kl-meter", className)}>
      <span>
        {label}: {available ? `${value}%` : unavailableLabel}
      </span>
      {available && <meter aria-label={label} min={0} max={100} value={value} />}
    </div>
  );
}
