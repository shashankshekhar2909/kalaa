import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { cx } from "../../util";
import { ChartMarker, ChartPatternDefs, chartColor } from "./scales";

export type ChartLegendItem = {
  /** Optional stable key. */
  id?: string;
  /** Series name. */
  label: ReactNode;
  /** Optional summary value or share shown next to the label. */
  value?: ReactNode;
  /** Optional colour token; defaults to `--kalaa-chart-N`. */
  color?: string;
  /** 0-based index for non-colour pattern/marker encoding. */
  seriesIndex?: number;
};

export type ChartLegendProps = ComponentPropsWithRef<"ul"> & {
  /** Series entries to display. */
  items: ReadonlyArray<ChartLegendItem>;
  /** Symbol style: `"marker"` for line charts, `"swatch"` for bar/donut charts (default `"swatch"`). */
  symbol?: "swatch" | "marker";
};

export function ChartLegend({
  items,
  symbol = "swatch",
  "aria-label": ariaLabel = "Chart legend",
  className,
  ...props
}: ChartLegendProps) {
  const uid = useId().replace(/:/g, "");
  if (items.length === 0) return null;
  return (
    <ul {...props} aria-label={ariaLabel} className={cx("kl-chart-legend", className)}>
      {items.map((item, idx) => {
        const seriesIdx = item.seriesIndex ?? idx;
        const color = item.color ?? chartColor(seriesIdx);
        const patIdx = ((seriesIdx % 8) + 8) % 8;
        return (
          <li key={item.id ?? idx} className="kl-chart-legend__item">
            <svg
              className="kl-chart-legend__swatch"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              aria-hidden="true"
            >
              {symbol === "marker" ? (
                <>
                  <line x1="1" y1="7" x2="13" y2="7" stroke={color} strokeWidth="2" />
                  <ChartMarker seriesIndex={seriesIdx} cx={7} cy={7} size={3.5} color={color} />
                </>
              ) : (
                <>
                  <ChartPatternDefs idPrefix={`${uid}-${idx}`} count={8} />
                  <rect x="1" y="1" width="12" height="12" fill={color} />
                  {patIdx > 0 && (
                    <rect x="1" y="1" width="12" height="12" fill={`url(#${uid}-${idx}-pat-${patIdx})`} />
                  )}
                </>
              )}
            </svg>
            <span>{item.label}</span>
            {item.value !== undefined && <span className="kl-chart-legend__value">({item.value})</span>}
          </li>
        );
      })}
    </ul>
  );
}
