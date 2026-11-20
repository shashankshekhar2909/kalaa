import { useId, useRef, useState, type ComponentPropsWithRef, type KeyboardEvent } from "react";
import { cx } from "../../util";
import { Table } from "../Table/Table";
import { ChartLegend } from "./ChartLegend";
import { ChartTooltip } from "./ChartTooltip";
import {
  bandScale,
  ChartPatternDefs,
  chartColor,
  formatChartNumber,
  linearScale,
  niceDomain,
  separateVerticalCenters,
  useChartWidth,
} from "./scales";

export type BarChartSeries = {
  /** Optional stable ID. */
  id?: string;
  /** Series display name. */
  label: string;
  /** One numeric value per category. */
  data: ReadonlyArray<number>;
  /** Optional colour token; defaults to `--kalaa-chart-N`. */
  color?: string;
};

export type BarChartProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** Category labels along the categorical axis. */
  categories: ReadonlyArray<string>;
  /** Data series to plot. */
  series: ReadonlyArray<BarChartSeries>;
  /** Accessible subject for the generated `role="img"` summary and data table caption. */
  label?: string;
  /** Bar orientation: `"vertical"` (default) or `"horizontal"`. */
  orientation?: "vertical" | "horizontal";
  /** Stacks series instead of grouping side by side (default false). */
  stacked?: boolean;
  /** Shows thin reference gridlines (default true). */
  showGrid?: boolean;
  /** Shows the series legend (default true). */
  showLegend?: boolean;
  /** Renders direct numeric labels on bars so meaning never relies on colour alone (default true). */
  showValues?: boolean;
  /** Overlays SVG hatch patterns on secondary series so series are distinguishable without colour (default true). */
  showPatterns?: boolean;
  /** Shows the "Show data" toggle that renders a Kalaa Table (default true). */
  showDataToggle?: boolean;
  /** Initial state of the "Show data" table (default false). */
  defaultShowData?: boolean;
  /** Plot height in px (default 260). */
  height?: number;
  /** Custom value formatter. */
  formatValue?: (value: number) => string;
};

type ActiveBar = {
  categoryIndex: number;
  seriesIndex: number;
  xPct: number;
  yPct: number;
};

export function BarChart({
  categories,
  series,
  label = "Bar chart",
  orientation = "vertical",
  stacked = false,
  showGrid = true,
  showLegend = true,
  showValues = true,
  showPatterns = true,
  showDataToggle = true,
  defaultShowData = false,
  height = 260,
  formatValue = formatChartNumber,
  className,
  ...props
}: BarChartProps) {
  const { containerRef, width } = useChartWidth(560);
  const [showData, setShowData] = useState(defaultShowData);
  const [active, setActive] = useState<ActiveBar | null>(null);
  const hitRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const uid = useId().replace(/:/g, "");
  const tableId = `${uid}-table`;

  const safeCategories = categories.length > 0 ? categories : ["—"];
  const safeSeries =
    series.length > 0 ? series : [{ id: "empty", label: "Value", data: safeCategories.map(() => 0) }];

  const rawMax = stacked
    ? Math.max(
        1,
        ...safeCategories.map((_, cIdx) =>
          safeSeries.reduce((sum, s) => sum + Math.max(0, s.data[cIdx] ?? 0), 0),
        ),
      )
    : Math.max(1, ...safeSeries.flatMap((s) => s.data.map((v) => (Number.isFinite(v) ? Math.max(0, v) : 0))));

  const [, niceMax] = niceDomain(0, rawMax * 1.08, 5);
  const pad =
    orientation === "horizontal"
      ? { top: 16, right: 44, bottom: 32, left: 104 }
      : { top: 22, right: 16, bottom: 36, left: 48 };
  const plotW = Math.max(60, width - pad.left - pad.right);
  const plotH = Math.max(60, height - pad.top - pad.bottom);

  const catScale =
    orientation === "vertical"
      ? bandScale(safeCategories, [pad.left, pad.left + plotW], 0.28)
      : bandScale(safeCategories, [pad.top, pad.top + plotH], 0.28);

  const valScale =
    orientation === "vertical"
      ? linearScale([0, niceMax], [pad.top + plotH, pad.top])
      : linearScale([0, niceMax], [pad.left, pad.left + plotW]);

  const ticks = valScale.ticks(5);

  const summaryParts = safeSeries.map((s) => {
    const vals = safeCategories.map((c, i) => `${c} ${formatValue(s.data[i] ?? 0)}`).join(", ");
    return `${s.label} (${vals})`;
  });
  const summary = `${label} (${stacked ? "stacked" : "grouped"} ${orientation} bar chart, ${safeSeries.length} series across ${safeCategories.length} categories): ${summaryParts.join("; ")}.`;

  type BarRect = {
    key: string;
    cIdx: number;
    sIdx: number;
    category: string;
    seriesLabel: string;
    value: number;
    x: number;
    y: number;
    w: number;
    h: number;
    hitX: number;
    hitY: number;
    color: string;
  };

  const bars: BarRect[] = [];
  safeCategories.forEach((cat, cIdx) => {
    const bandStart = catScale(cat);
    const bw = catScale.bandwidth;
    let running = 0;
    const categoryBars: BarRect[] = [];

    safeSeries.forEach((s, sIdx) => {
      const value = Math.max(0, s.data[cIdx] ?? 0);
      const color = s.color ?? chartColor(sIdx);
      if (orientation === "vertical") {
        if (stacked) {
          const y1 = valScale(running + value);
          const y0 = valScale(running);
          running += value;
          const h = Math.max(2, y0 - y1);
          categoryBars.push({
            key: `${cIdx}-${sIdx}`,
            cIdx,
            sIdx,
            category: cat,
            seriesLabel: s.label,
            value,
            x: bandStart,
            y: y1,
            w: bw,
            h,
            hitX: bandStart + bw / 2,
            hitY: y1 + h / 2,
            color,
          });
        } else {
          const subW = Math.max(2, (bw - (safeSeries.length - 1) * 2) / safeSeries.length);
          const x = bandStart + sIdx * (subW + 2);
          const y1 = valScale(value);
          const y0 = valScale(0);
          const h = Math.max(2, y0 - y1);
          categoryBars.push({
            key: `${cIdx}-${sIdx}`,
            cIdx,
            sIdx,
            category: cat,
            seriesLabel: s.label,
            value,
            x,
            y: y1,
            w: subW,
            h,
            hitX: x + subW / 2,
            hitY: y1 + h / 2,
            color,
          });
        }
      } else if (stacked) {
        const x0 = valScale(running);
        const x1 = valScale(running + value);
        running += value;
        const w = Math.max(2, x1 - x0);
        categoryBars.push({
          key: `${cIdx}-${sIdx}`,
          cIdx,
          sIdx,
          category: cat,
          seriesLabel: s.label,
          value,
          x: x0,
          y: bandStart,
          w,
          h: bw,
          hitX: x0 + w / 2,
          hitY: bandStart + bw / 2,
          color,
        });
      } else {
        const subH = Math.max(2, (bw - (safeSeries.length - 1) * 2) / safeSeries.length);
        const y = bandStart + sIdx * (subH + 2);
        const x0 = valScale(0);
        const x1 = valScale(value);
        const w = Math.max(2, x1 - x0);
        categoryBars.push({
          key: `${cIdx}-${sIdx}`,
          cIdx,
          sIdx,
          category: cat,
          seriesLabel: s.label,
          value,
          x: x0,
          y,
          w,
          h: subH,
          hitX: x0 + w / 2,
          hitY: y + subH / 2,
          color,
        });
      }
    });

    if (orientation === "vertical") {
      const separatedY = separateVerticalCenters(
        categoryBars.map((b) => b.hitY),
        25,
        14,
        height - 14,
      );
      categoryBars.forEach((b, idx) => {
        b.hitY = separatedY[idx];
      });
    } else {
      const separatedX = separateVerticalCenters(
        categoryBars.map((b) => b.hitX),
        28,
        pad.left + 14,
        width - 14,
      );
      categoryBars.forEach((b, idx) => {
        b.hitX = separatedX[idx];
      });
    }
    bars.push(...categoryBars);
  });

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "Escape") {
      setActive(null);
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = (index + 1) % bars.length;
      hitRefs.current[next]?.focus();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const prev = (index - 1 + bars.length) % bars.length;
      hitRefs.current[prev]?.focus();
    }
  }

  return (
    <div {...props} ref={containerRef} className={cx("kl-chart", "kl-bar-chart", className)}>
      {(showLegend || showDataToggle) && (
        <div className="kl-chart__toolbar">
          {showLegend ? (
            <ChartLegend
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
          {showPatterns && <ChartPatternDefs idPrefix={uid} count={8} />}

          {showGrid &&
            ticks.map((t) => {
              const pos = valScale(t);
              return orientation === "vertical" ? (
                <g key={t}>
                  <line
                    x1={pad.left}
                    y1={pos}
                    x2={pad.left + plotW}
                    y2={pos}
                    className={t === 0 ? "kl-chart__baseline" : "kl-chart__gridline"}
                  />
                  <text
                    x={pad.left - 8}
                    y={pos}
                    textAnchor="end"
                    dominantBaseline="central"
                    className="kl-chart__axis-label"
                  >
                    {formatValue(t)}
                  </text>
                </g>
              ) : (
                <g key={t}>
                  <line
                    x1={pos}
                    y1={pad.top}
                    x2={pos}
                    y2={pad.top + plotH}
                    className={t === 0 ? "kl-chart__baseline" : "kl-chart__gridline"}
                  />
                  <text x={pos} y={pad.top + plotH + 18} textAnchor="middle" className="kl-chart__axis-label">
                    {formatValue(t)}
                  </text>
                </g>
              );
            })}

          {safeCategories.map((cat) => {
            const center = catScale(cat) + catScale.bandwidth / 2;
            return orientation === "vertical" ? (
              <text
                key={cat}
                x={center}
                y={pad.top + plotH + 20}
                textAnchor="middle"
                className="kl-chart__axis-label"
              >
                {cat}
              </text>
            ) : (
              <text
                key={cat}
                x={pad.left - 8}
                y={center}
                textAnchor="end"
                dominantBaseline="central"
                className="kl-chart__axis-label"
              >
                {cat}
              </text>
            );
          })}

          {bars.map((b) => {
            const patIdx = ((b.sIdx % 8) + 8) % 8;
            const isLastInStack = !stacked || b.sIdx === safeSeries.length - 1;
            const totalForStack = stacked
              ? safeSeries.reduce((sum, s) => sum + Math.max(0, s.data[b.cIdx] ?? 0), 0)
              : b.value;
            return (
              <g key={b.key}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.color} />
                {showPatterns && patIdx > 0 && (
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={`url(#${uid}-pat-${patIdx})`} />
                )}
                {showValues && isLastInStack && (
                  <text
                    x={orientation === "vertical" ? b.x + b.w / 2 : b.x + b.w + 6}
                    y={orientation === "vertical" ? b.y - 6 : b.y + b.h / 2}
                    textAnchor={orientation === "vertical" ? "middle" : "start"}
                    dominantBaseline={orientation === "vertical" ? "auto" : "central"}
                    className="kl-chart__value-label"
                  >
                    {formatValue(totalForStack)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="kl-chart__overlay">
          {bars.map((b, idx) => {
            const xPct = (b.hitX / width) * 100;
            const yPct = (b.hitY / height) * 100;
            const activate = () =>
              setActive({
                categoryIndex: b.cIdx,
                seriesIndex: b.sIdx,
                xPct: ((b.x + b.w / 2) / width) * 100,
                yPct: (b.y / height) * 100,
              });
            return (
              <button
                key={b.key}
                ref={(el) => {
                  hitRefs.current[idx] = el;
                }}
                type="button"
                className="kl-chart__hit kl-chart__hit--point"
                aria-label={`${b.category}, ${b.seriesLabel}: ${formatValue(b.value)}`}
                style={{
                  left: `${xPct}%`,
                  top: `${yPct}%`,
                }}
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
                <th scope="col">Category</th>
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
