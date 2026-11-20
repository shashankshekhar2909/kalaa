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
  /** Optional explicit minimum value-axis bound. */
  yMin?: number;
  /** Optional explicit maximum value-axis bound. */
  yMax?: number;
  /** Optional explicit minimum value-axis bound (alias for `yMin`). */
  min?: number;
  /** Optional explicit maximum value-axis bound (alias for `yMax`). */
  max?: number;
  /** Custom value formatter. */
  formatValue?: (value: number) => string;
};

type ActiveBar = {
  key: string;
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
  yMin,
  yMax,
  min,
  max,
  formatValue = formatChartNumber,
  className,
  ...props
}: BarChartProps) {
  const { containerRef, width } = useChartWidth(560);
  const [showData, setShowData] = useState(defaultShowData);
  const [active, setActive] = useState<ActiveBar | null>(null);
  const [pinnedKey, setPinnedKey] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const hitRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const uid = useId().replace(/:/g, "");
  const tableId = `${uid}-table`;
  const tooltipId = `${uid}-tooltip`;
  const instructionsId = `${uid}-instructions`;

  const safeCategories = categories.length > 0 ? categories : ["—"];
  const safeSeries =
    series.length > 0 ? series : [{ id: "empty", label: "Value", data: safeCategories.map(() => 0) }];

  const posSumsByCategory = safeCategories.map((_, cIdx) =>
    safeSeries.reduce((sum, s) => {
      const v = s.data[cIdx] ?? 0;
      return Number.isFinite(v) && v > 0 ? sum + v : sum;
    }, 0),
  );
  const negSumsByCategory = safeCategories.map((_, cIdx) =>
    safeSeries.reduce((sum, s) => {
      const v = s.data[cIdx] ?? 0;
      return Number.isFinite(v) && v < 0 ? sum + v : sum;
    }, 0),
  );

  const finiteValues = safeSeries.flatMap((s) => s.data.filter(Number.isFinite));
  const dataMin = stacked ? Math.min(0, ...negSumsByCategory) : Math.min(0, ...finiteValues);
  const dataMax = stacked ? Math.max(0, ...posSumsByCategory) : Math.max(0, ...finiteValues);

  const explicitMin = yMin ?? min;
  const explicitMax = yMax ?? max;
  const targetMin = explicitMin !== undefined ? Math.min(0, explicitMin, dataMin) : dataMin;
  const targetMax = explicitMax !== undefined ? Math.max(0, explicitMax, dataMax) : dataMax;

  let domainMin = 0;
  let domainMax = 1;
  if (targetMin < 0) {
    const [nMin, nMax] = niceDomain(targetMin, targetMax > 0 ? targetMax : 0, 5);
    domainMin =
      explicitMin !== undefined && dataMin >= explicitMin && explicitMin <= 0
        ? explicitMin
        : Math.min(0, nMin);
    domainMax =
      explicitMax !== undefined && dataMax <= explicitMax && explicitMax > domainMin
        ? explicitMax
        : Math.max(0, targetMax > 0 ? nMax : 0);
    if (domainMax <= domainMin) domainMax = domainMin + 1;
  } else {
    const [, nMax] = niceDomain(0, Math.max(1, targetMax), 5);
    domainMin = 0;
    domainMax = explicitMax !== undefined && dataMax <= explicitMax && explicitMax > 0 ? explicitMax : nMax;
  }

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
      ? linearScale([domainMin, domainMax], [pad.top + plotH, pad.top])
      : linearScale([domainMin, domainMax], [pad.left, pad.left + plotW]);

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
    showStackLabel: boolean;
    stackTotal: number;
  };

  const bars: BarRect[] = [];
  safeCategories.forEach((cat, cIdx) => {
    const bandStart = catScale(cat);
    const bw = catScale.bandwidth;
    let runningPos = 0;
    let runningNeg = 0;
    const categoryBars: BarRect[] = [];

    const hasNegativeInCategory = safeSeries.some((s) => (s.data[cIdx] ?? 0) < 0);
    let lastNonNegIdx = -1;
    let lastNegIdx = -1;
    safeSeries.forEach((s, sIdx) => {
      const v = Number.isFinite(s.data[cIdx]) ? (s.data[cIdx] as number) : 0;
      if (v < 0) {
        lastNegIdx = sIdx;
      } else if (v > 0 || !hasNegativeInCategory) {
        lastNonNegIdx = sIdx;
      }
    });

    safeSeries.forEach((s, sIdx) => {
      const rawVal = s.data[cIdx] ?? 0;
      const value = Number.isFinite(rawVal) ? rawVal : 0;
      const color = s.color ?? chartColor(sIdx);
      const isNeg = value < 0;
      const showStackLabel = !stacked ? true : isNeg ? sIdx === lastNegIdx : sIdx === lastNonNegIdx;
      const stackTotal = !stacked ? value : isNeg ? negSumsByCategory[cIdx] : posSumsByCategory[cIdx];

      if (orientation === "vertical") {
        if (stacked) {
          const startVal = isNeg ? runningNeg : runningPos;
          const endVal = startVal + value;
          if (isNeg) runningNeg = endVal;
          else runningPos = endVal;
          const y0 = valScale(startVal);
          const y1 = valScale(endVal);
          const h = Math.max(2, Math.abs(y0 - y1));
          const y = isNeg ? y0 : y1;
          categoryBars.push({
            key: `${cIdx}-${sIdx}`,
            cIdx,
            sIdx,
            category: cat,
            seriesLabel: s.label,
            value,
            x: bandStart,
            y,
            w: bw,
            h,
            hitX: bandStart + bw / 2,
            hitY: y + h / 2,
            color,
            showStackLabel,
            stackTotal,
          });
        } else {
          const subW = Math.max(2, (bw - (safeSeries.length - 1) * 2) / safeSeries.length);
          const x = bandStart + sIdx * (subW + 2);
          const y0 = valScale(0);
          const y1 = valScale(value);
          const h = Math.max(2, Math.abs(y0 - y1));
          const y = isNeg ? y0 : y1;
          categoryBars.push({
            key: `${cIdx}-${sIdx}`,
            cIdx,
            sIdx,
            category: cat,
            seriesLabel: s.label,
            value,
            x,
            y,
            w: subW,
            h,
            hitX: x + subW / 2,
            hitY: y + h / 2,
            color,
            showStackLabel,
            stackTotal,
          });
        }
      } else if (stacked) {
        const startVal = isNeg ? runningNeg : runningPos;
        const endVal = startVal + value;
        if (isNeg) runningNeg = endVal;
        else runningPos = endVal;
        const x0 = valScale(startVal);
        const x1 = valScale(endVal);
        const w = Math.max(2, Math.abs(x1 - x0));
        const x = isNeg ? x1 : x0;
        categoryBars.push({
          key: `${cIdx}-${sIdx}`,
          cIdx,
          sIdx,
          category: cat,
          seriesLabel: s.label,
          value,
          x,
          y: bandStart,
          w,
          h: bw,
          hitX: x + w / 2,
          hitY: bandStart + bw / 2,
          color,
          showStackLabel,
          stackTotal,
        });
      } else {
        const subH = Math.max(2, (bw - (safeSeries.length - 1) * 2) / safeSeries.length);
        const y = bandStart + sIdx * (subH + 2);
        const x0 = valScale(0);
        const x1 = valScale(value);
        const w = Math.max(2, Math.abs(x1 - x0));
        const x = isNeg ? x1 : x0;
        categoryBars.push({
          key: `${cIdx}-${sIdx}`,
          cIdx,
          sIdx,
          category: cat,
          seriesLabel: s.label,
          value,
          x,
          y,
          w,
          h: subH,
          hitX: x + w / 2,
          hitY: y + subH / 2,
          color,
          showStackLabel,
          stackTotal,
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

  const activeFocusIndex = bars.length > 0 ? Math.min(focusedIndex, bars.length - 1) : 0;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "Escape") {
      setPinnedKey(null);
      setActive(null);
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = (index + 1) % bars.length;
      setFocusedIndex(next);
      hitRefs.current[next]?.focus();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const prev = (index - 1 + bars.length) % bars.length;
      setFocusedIndex(prev);
      hitRefs.current[prev]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      setFocusedIndex(0);
      hitRefs.current[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      const last = Math.max(0, bars.length - 1);
      setFocusedIndex(last);
      hitRefs.current[last]?.focus();
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
        <span id={instructionsId} className="kl-chart__sr-only">
          Use arrow keys to navigate bars, Enter or Space to pin the tooltip, and Escape to dismiss.
        </span>
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
            const isNeg = b.value < 0;
            const labelX = orientation === "vertical" ? b.x + b.w / 2 : isNeg ? b.x - 6 : b.x + b.w + 6;
            const labelY = orientation === "vertical" ? (isNeg ? b.y + b.h + 12 : b.y - 6) : b.y + b.h / 2;
            const labelAnchor = orientation === "vertical" ? "middle" : isNeg ? "end" : "start";
            return (
              <g key={b.key}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.color} />
                {showPatterns && patIdx > 0 && (
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={`url(#${uid}-pat-${patIdx})`} />
                )}
                {showValues && b.showStackLabel && (
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={labelAnchor}
                    dominantBaseline={orientation === "vertical" ? "auto" : "central"}
                    className="kl-chart__value-label"
                  >
                    {formatValue(b.stackTotal)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="kl-chart__overlay" role="group" aria-label={`${label} data points`}>
          {bars.map((b, idx) => {
            const xPct = (b.hitX / width) * 100;
            const yPct = (b.hitY / height) * 100;
            const isThisActive = active?.key === b.key;
            const isThisPinned = pinnedKey === b.key;
            const activate = () =>
              setActive({
                key: b.key,
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
                tabIndex={idx === activeFocusIndex ? 0 : -1}
                aria-pressed={isThisPinned}
                aria-describedby={isThisActive ? `${tooltipId} ${instructionsId}` : instructionsId}
                className="kl-chart__hit kl-chart__hit--point"
                aria-label={`${b.category}, ${b.seriesLabel}: ${formatValue(b.value)}`}
                style={{
                  left: `${xPct}%`,
                  top: `${yPct}%`,
                }}
                onFocus={() => {
                  setFocusedIndex(idx);
                  if (pinnedKey !== null && pinnedKey !== b.key) {
                    setPinnedKey(null);
                  }
                  activate();
                }}
                onBlur={() => {
                  if (pinnedKey !== b.key) {
                    setActive(null);
                  }
                }}
                onMouseEnter={() => {
                  if (pinnedKey === null) {
                    activate();
                  }
                }}
                onMouseLeave={() => {
                  if (pinnedKey === null) {
                    setActive(null);
                  }
                }}
                onClick={() => {
                  setFocusedIndex(idx);
                  if (isThisActive && isThisPinned) {
                    setPinnedKey(null);
                    setActive(null);
                  } else {
                    setPinnedKey(b.key);
                    activate();
                  }
                }}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              />
            );
          })}
        </div>

        {active !== null && (
          <ChartTooltip
            id={tooltipId}
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

      <div id={tableId} hidden={!showData}>
        {showData && (
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
        )}
      </div>
    </div>
  );
}
