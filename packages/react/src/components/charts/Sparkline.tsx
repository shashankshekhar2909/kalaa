import type { ComponentPropsWithRef } from "react";
import { cx } from "../../util";
import { formatChartNumber } from "./scales";

export type SparklineTone =
  "accent" | "success" | "warning" | "danger" | "chart-1" | "chart-2" | "chart-3" | "chart-4";

export type SparklineProps = Omit<ComponentPropsWithRef<"svg">, "children"> & {
  /** Ordered numeric series. */
  data: ReadonlyArray<number>;
  /** Accessible name for `role="img"`. */
  label: string;
  /** SVG width in px (default 120). */
  width?: number;
  /** SVG height in px (default 32). */
  height?: number;
  /** Stroke colour token role (default `"chart-1"`). */
  tone?: SparklineTone;
  /** Fills a subtle area under the line (default false). */
  area?: boolean;
  /** Highlights the final value marker (default true). */
  showEndMarker?: boolean;
  /** Number formatter for the generated summary. */
  formatValue?: (value: number) => string;
};

export function Sparkline({
  data,
  label,
  width = 120,
  height = 32,
  tone = "chart-1",
  area = false,
  showEndMarker = true,
  formatValue = formatChartNumber,
  className,
  ...props
}: SparklineProps) {
  const safe = data.length > 0 ? data : [0];
  const min = Math.min(...safe);
  const max = Math.max(...safe);
  const first = safe[0] ?? 0;
  const last = safe[safe.length - 1] ?? 0;
  const pad = 4;
  const innerW = Math.max(1, width - pad * 2);
  const innerH = Math.max(1, height - pad * 2);
  const span = max - min || 1;

  const coords = safe.map((v, i) => {
    const x = pad + (safe.length === 1 ? innerW / 2 : (i / (safe.length - 1)) * innerW);
    const y = pad + innerH - ((v - min) / span) * innerH;
    return [Number(x.toFixed(2)), Number(y.toFixed(2))] as const;
  });

  const polylinePoints = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const lastCoord = coords[coords.length - 1] ?? [pad, pad];
  const firstCoord = coords[0] ?? [pad, pad];
  const areaPath =
    coords.length > 1
      ? `M ${firstCoord[0]} ${height - pad} L ${coords.map(([x, y]) => `${x} ${y}`).join(" L ")} L ${lastCoord[0]} ${height - pad} Z`
      : "";

  const direction = last > first ? "up" : last < first ? "down" : "flat";
  const summary = `${label}: ${safe.length} points, trending ${direction} from ${formatValue(first)} to ${formatValue(last)} (min ${formatValue(min)}, max ${formatValue(max)}).`;
  const strokeColor = `var(--kalaa-${tone})`;

  return (
    <svg
      {...props}
      role="img"
      aria-label={summary}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cx("kl-sparkline", className)}
    >
      {area && areaPath && <path d={areaPath} fill={strokeColor} fillOpacity={0.14} />}
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinejoin="miter"
        strokeLinecap="butt"
        points={polylinePoints}
      />
      {showEndMarker && (
        <rect x={lastCoord[0] - 2.25} y={lastCoord[1] - 2.25} width="4.5" height="4.5" fill={strokeColor} />
      )}
    </svg>
  );
}
