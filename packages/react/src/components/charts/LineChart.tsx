import { useId, useRef, useState, type ComponentPropsWithRef, type KeyboardEvent } from "react";
import { cx } from "../../util";
import { Table } from "../Table/Table";
import { ChartLegend } from "./ChartLegend";
import { ChartTooltip } from "./ChartTooltip";
import {
  CHART_DASH_ARRAYS,
  ChartMarker,
  chartColor,
  formatChartNumber,
  linearScale,
  niceDomain,
  separateVerticalCenters,
  useChartWidth,
} from "./scales";

export type LineChartSeries = {
  /** Optional stable ID. */
  id?: string;
  /** Series display name. */
  label: string;
  /** Numeric values corresponding to `categories`. */
  data: ReadonlyArray<number>;
  /** Optional colour token; defaults to `--kalaa-chart-N`. */
  color?: string;
};

export type LineChartProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** Ordered x-axis labels (weeks, dates, checkpoints). */
  categories: ReadonlyArray<string>;
  /** One or more series to plot. */
  series: ReadonlyArray<LineChartSeries>;
  /** Accessible subject for the `role="img"` summary and data table caption. */
  label?: string;
  /** Renders a subtle area fill beneath each series (default false). */
  area?: boolean;
  /** Shows thin reference gridlines (default true). */
  showGrid?: boolean;
  /** Shows the series legend (default true). */
  showLegend?: boolean;
  /** Shows direct end-of-series labels alongside distinct dash styles and markers (default true). */
  showDirectLabels?: boolean;
  /** Shows the "Show data" toggle rendering a Kalaa Table (default true). */
  showDataToggle?: boolean;
  /** Initial state of the "Show data" table (default false). */
  defaultShowData?: boolean;
  /** Plot height in px (default 260). */
  height?: number;
  /** Optional explicit minimum y-axis bound. */
  yMin?: number;
  /** Optional explicit maximum y-axis bound. */
  yMax?: number;
  /** Custom value formatter. */
  formatValue?: (value: number) => string;
};

type ActivePoint = {
  categoryIndex: number;
  seriesIndex: number;
  xPct: number;
  yPct: number;
};

export function LineChart({
  categories,
  series,
  label = "Line chart",
  area = false,
  showGrid = true,
  showLegend = true,
  showDirectLabels = true,
  showDataToggle = true,
  defaultShowData = false,
  height = 260,
  yMin,
  yMax,
  formatValue = formatChartNumber,
  className,
  ...props
}: LineChartProps) {
  const { containerRef, width } = useChartWidth(560);
  const [showData, setShowData] = useState(defaultShowData);
  const [active, setActive] = useState<ActivePoint | null>(null);
  const hitRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tableId = `${useId().replace(/:/g, "")}-table`;

  const safeCategories = categories.length > 0 ? categories : ["—"];
  const safeSeries =
    series.length > 0 ? series : [{ id: "empty", label: "Value", data: safeCategories.map(() => 0) }];

  const allVals = safeSeries.flatMap((s) => s.data.filter(Number.isFinite));
  const rawMin = yMin ?? Math.min(0, ...(allVals.length ? allVals : [0]));
  const rawMax = yMax ?? Math.max(1, ...(allVals.length ? allVals : [1]));
  const [niceMin, niceMax] = niceDomain(rawMin, rawMax, 5);
  const domainMin = yMin ?? niceMin;
  const domainMax = yMax ?? niceMax;

  const pad = { top: 20, right: showDirectLabels ? 96 : 24, bottom: 36, left: 48 };
  const plotW = Math.max(60, width - pad.left - pad.right);
  const plotH = Math.max(60, height - pad.top - pad.bottom);

  const yScale = linearScale([domainMin, domainMax], [pad.top + plotH, pad.top]);
  const xAt = (idx: number) =>
    pad.left + (safeCategories.length <= 1 ? plotW / 2 : (idx / (safeCategories.length - 1)) * plotW);

  const ticks = yScale.ticks(5);

  const summaryParts = safeSeries.map((s) => {
    const first = s.data[0] ?? 0;
    const last = s.data[s.data.length - 1] ?? 0;
    const min = Math.min(...(s.data.length ? s.data : [0]));
    const max = Math.max(...(s.data.length ? s.data : [0]));
    return `${s.label} from ${formatValue(first)} to ${formatValue(last)} (min ${formatValue(min)}, max ${formatValue(max)})`;
  });
  const summary = `${label} (${area ? "area" : "line"} chart, ${safeSeries.length} series across ${safeCategories.length} points from ${safeCategories[0]} to ${safeCategories[safeCategories.length - 1]}): ${summaryParts.join("; ")}.`;

  type PointHit = {
    key: string;
    sIdx: number;
    cIdx: number;
    seriesLabel: string;
    category: string;
    value: number;
    x: number;
    y: number;
    hitY: number;
    color: string;
  };

  const hitYByCategory = safeCategories.map((_, cIdx) =>
    separateVerticalCenters(
      safeSeries.map((s) => yScale(s.data[cIdx] ?? 0)),
      25,
      14,
      height - 14,
    ),
  );

  const points: PointHit[] = [];
  safeSeries.forEach((s, sIdx) => {
    const color = s.color ?? chartColor(sIdx);
    safeCategories.forEach((cat, cIdx) => {
      const value = s.data[cIdx] ?? 0;
      const y = yScale(value);
      points.push({
        key: `${sIdx}-${cIdx}`,
        sIdx,
        cIdx,
        seriesLabel: s.label,
        category: cat,
        value,
        x: xAt(cIdx),
        y,
        hitY: hitYByCategory[cIdx]?.[sIdx] ?? y,
        color,
      });
    });
  });

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "Escape") {
      setActive(null);
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = (index + 1) % points.length;
      hitRefs.current[next]?.focus();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const prev = (index - 1 + points.length) % points.length;
      hitRefs.current[prev]?.focus();
    }
  }

  return (
    <div {...props} ref={containerRef} className={cx("kl-chart", "kl-line-chart", className)}>
      {(showLegend || showDataToggle) && (
        <div className="kl-chart__toolbar">
          {showLegend ? (
            <ChartLegend
              symbol="marker"
              items={safeSeries.map((s, idx) => ({
                id: s.id ?? s.label,
                label: s.label,
                color: s.color,
                seriesIndex: idx,
              }))}
            />
          ) : (
            <span />
          )}
          {showDataToggle && (
            <button
              type="button"
              className="kl-chart__toggle"
              aria-expanded={showData}
              aria-controls={tableId}
              onClick={() => setShowData((prev) => !prev)}
            >
              {showData ? "Hide data" : "Show data"}
            </button>
          )}
        </div>
      )}

      <div className="kl-chart__stage">
        <svg
          role="img"
          aria-label={summary}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="kl-chart__svg"
        >
          {showGrid &&
            ticks.map((t) => {
              const y = yScale(t);
              return (
                <g key={t}>
                  <line
                    x1={pad.left}
                    y1={y}
                    x2={pad.left + plotW}
                    y2={y}
                    className={t === domainMin ? "kl-chart__baseline" : "kl-chart__gridline"}
                  />
                  <text
                    x={pad.left - 8}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="central"
                    className="kl-chart__axis-label"
                  >
                    {formatValue(t)}
                  </text>
                </g>
              );
            })}

          {safeCategories.map((cat, cIdx) => (
            <text
              key={cat}
              x={xAt(cIdx)}
              y={pad.top + plotH + 20}
              textAnchor="middle"
              className="kl-chart__axis-label"
            >
              {cat}
            </text>
          ))}

          {safeSeries.map((s, sIdx) => {
            const color = s.color ?? chartColor(sIdx);
            const coords = safeCategories.map((_, cIdx) => [xAt(cIdx), yScale(s.data[cIdx] ?? 0)]);
            const poly = coords.map(([x, y]) => `${x},${y}`).join(" ");
            const first = coords[0] ?? [pad.left, pad.top + plotH];
            const last = coords[coords.length - 1] ?? [pad.left, pad.top + plotH];
            const areaPath =
              coords.length > 1
                ? `M ${first[0]} ${pad.top + plotH} L ${coords.map(([x, y]) => `${x} ${y}`).join(" L ")} L ${last[0]} ${pad.top + plotH} Z`
                : "";
            const dash = CHART_DASH_ARRAYS[sIdx % CHART_DASH_ARRAYS.length];
            const lastValue = s.data[s.data.length - 1] ?? 0;

            return (
              <g key={s.id ?? s.label}>
                {area && areaPath && <path d={areaPath} fill={color} fillOpacity={0.12} />}
                <polyline fill="none" stroke={color} strokeWidth="2" strokeDasharray={dash} points={poly} />
                {coords.map(([cxCoord, cyCoord], cIdx) => (
                  <ChartMarker
                    key={cIdx}
                    seriesIndex={sIdx}
                    cx={cxCoord}
                    cy={cyCoord}
                    size={4}
                    color={color}
                  />
                ))}
                {showDirectLabels && (
                  <text
                    x={last[0] + 8}
                    y={last[1]}
                    dominantBaseline="central"
                    className="kl-chart__value-label"
                  >
                    {s.label} ({formatValue(lastValue)})
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="kl-chart__overlay">
          {points.map((pt, idx) => {
            const xPct = (pt.x / width) * 100;
            const yPct = (pt.hitY / height) * 100;
            const activate = () =>
              setActive({
                categoryIndex: pt.cIdx,
                seriesIndex: pt.sIdx,
                xPct,
                yPct: (pt.y / height) * 100,
              });
            return (
              <button
                key={pt.key}
                ref={(el) => {
                  hitRefs.current[idx] = el;
                }}
                type="button"
                className="kl-chart__hit kl-chart__hit--point"
                aria-label={`${pt.category}, ${pt.seriesLabel}: ${formatValue(pt.value)}`}
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
                onFocus={activate}
                onBlur={() => setActive(null)}
                onMouseEnter={activate}
                onMouseLeave={() => setActive(null)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              />
            );
          })}
        </div>

        {active !== null && (
          <ChartTooltip
            floating
            x={active.xPct}
            y={active.yPct}
            label={safeCategories[active.categoryIndex]}
            items={safeSeries.map((s, sIdx) => ({
              label: s.label,
              value: formatValue(s.data[active.categoryIndex] ?? 0),
              color: s.color,
              seriesIndex: sIdx,
            }))}
          />
        )}
      </div>

      {showData && (
        <div id={tableId}>
          <Table caption={`${label} data`}>
            <thead>
              <tr>
                <th scope="col">Period</th>
                {safeSeries.map((s, sIdx) => (
                  <th key={s.id ?? sIdx} scope="col">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {safeCategories.map((cat, cIdx) => (
                <tr key={cat}>
                  <th scope="row">{cat}</th>
                  {safeSeries.map((s, sIdx) => (
                    <td key={s.id ?? sIdx}>{formatValue(s.data[cIdx] ?? 0)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
