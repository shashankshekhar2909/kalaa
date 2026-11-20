import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
import { ChartMarker, chartColor } from "./scales";

export type ChartTooltipItem = {
  /** Series or metric name. */
  label: ReactNode;
  /** Formatted value. */
  value: ReactNode;
  /** Optional token colour; defaults to `--kalaa-chart-N` from `seriesIndex`. */
  color?: string;
  /** 0-based series index for shape + colour encoding. */
  seriesIndex?: number;
};

export type ChartTooltipProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  /** Category, date or slice heading. */
  label?: ReactNode;
  /** Series rows displayed inside the tooltip. */
  items: ReadonlyArray<ChartTooltipItem>;
  /** Whether the tooltip is visible (default true). */
  open?: boolean;
  /** Horizontal anchor in percentage (0..100) when positioned over a chart stage. */
  x?: number;
  /** Vertical anchor in percentage (0..100) when positioned over a chart stage. */
  y?: number;
  /** Positions the tooltip absolutely at `(x%, y%)` over a chart stage. */
  floating?: boolean;
};

export function ChartTooltip({
  label,
  items,
  open = true,
  x,
  y,
  floating = false,
  className,
  style,
  ...props
}: ChartTooltipProps) {
  if (!open || items.length === 0) return null;
  const clampedX = typeof x === "number" ? Math.max(12, Math.min(88, x)) : undefined;
  const clampedY = typeof y === "number" ? Math.max(16, Math.min(92, y)) : undefined;
  return (
    <div
      {...props}
      role="tooltip"
      className={cx("kl-chart-tooltip", floating && "kl-chart-tooltip--floating", className)}
      style={
        floating && clampedX !== undefined && clampedY !== undefined
          ? { left: `${clampedX}%`, top: `${clampedY}%`, ...style }
          : style
      }
    >
      {label !== undefined && <div className="kl-chart-tooltip__title">{label}</div>}
      <ul className="kl-chart-tooltip__list">
        {items.map((item, idx) => {
          const seriesIdx = item.seriesIndex ?? idx;
          const color = item.color ?? chartColor(seriesIdx);
          return (
            <li key={idx} className="kl-chart-tooltip__row">
              <span className="kl-chart-tooltip__series">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <ChartMarker seriesIndex={seriesIdx} cx={6} cy={6} size={3.5} color={color} />
                </svg>
                <span>{item.label}</span>
              </span>
              <span className="kl-chart-tooltip__value">{item.value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
