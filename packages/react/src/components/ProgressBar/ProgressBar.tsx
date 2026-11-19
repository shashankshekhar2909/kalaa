import type { ComponentPropsWithRef } from "react";
import { Progress } from "@base-ui/react/progress";
import { cx } from "../../util";
export type ProgressBarProps = Omit<ComponentPropsWithRef<"div">, "label"> & {
  value: number;
  max?: number;
  label: string;
  hideLabel?: boolean;
  tone?: "accent" | "success" | "warning" | "danger";
};
export function ProgressBar({
  value,
  max = 100,
  label,
  hideLabel = false,
  tone = "accent",
  className,
  ...props
}: ProgressBarProps) {
  return (
    <Progress.Root
      {...props}
      value={value}
      max={max}
      className={cx("kl-progress", `kl-progress--${tone}`, className)}
    >
      <div className={cx("kl-progress__header", hideLabel && "kl-progress__label--hidden")}>
        <Progress.Label className="kl-progress__label">{label}</Progress.Label>
        <Progress.Value className="kl-progress__value" />
      </div>
      <Progress.Track className="kl-progress__track">
        <Progress.Indicator
          className="kl-progress__indicator"
          style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }}
        />
      </Progress.Track>
    </Progress.Root>
  );
}
