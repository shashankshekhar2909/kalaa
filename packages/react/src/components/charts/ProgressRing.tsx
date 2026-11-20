import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";

export type ProgressRingTone =
  "accent" | "success" | "warning" | "danger" | "chart-1" | "chart-2" | "chart-3";

export type ProgressRingProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** Current numeric value. */
  value: number;
  /** Maximum value representing 100% (default 100). */
  max?: number;
  /** Accessible name and caption. */
  label: string;
  /** Custom centre text; defaults to rounded percentage (`"84%"`). */
  displayValue?: ReactNode;
  /** Ring diameter preset or pixel size (`sm`=56, `md`=76, `lg`=96; default `"md"`). */
  size?: "sm" | "md" | "lg" | number;
  /** Ring stroke thickness in px (default 7). */
  strokeWidth?: number;
  /** Fill colour token role (default `"chart-1"`). */
  tone?: ProgressRingTone;
  /** Hides the visible caption below the ring while keeping the SVG `role="img"` summary. */
  hideLabel?: boolean;
};

const SIZE_MAP = {
  sm: 56,
  md: 76,
  lg: 96,
} as const;

export function ProgressRing({
  value,
  max = 100,
  label,
  displayValue,
  size = "md",
  strokeWidth = 7,
  tone = "chart-1",
  hideLabel = false,
  className,
  ...props
}: ProgressRingProps) {
  const diameter = typeof size === "number" ? size : SIZE_MAP[size];
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.max(0, Math.min(safeMax, Number.isFinite(value) ? value : 0));
  const pct = Math.round((clamped / safeMax) * 100);
  const center = diameter / 2;
  const radius = Math.max(4, center - strokeWidth);
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / safeMax);
  const summary = `${label}: ${pct}% (${clamped} of ${safeMax}).`;
  const centerText = displayValue ?? `${pct}%`;

  return (
    <div {...props} className={cx("kl-progress-ring", className)}>
      <svg
        role="img"
        aria-label={summary}
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        className="kl-progress-ring__svg"
      >
        <circle
          className="kl-progress-ring__track"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="kl-progress-ring__fill"
          cx={center}
          cy={center}
          r={radius}
          stroke={`var(--kalaa-${tone})`}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="central"
          className="kl-progress-ring__text"
        >
          {centerText}
        </text>
      </svg>
      <span className={cx("kl-progress-ring__label", hideLabel && "kl-progress-ring__label--hidden")}>
        {label}
      </span>
    </div>
  );
}
