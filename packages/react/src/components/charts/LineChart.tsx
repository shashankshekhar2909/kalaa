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
  /** Numeric values corresponding to `categories` (`null` or `undefined` represents a missing observation). */
  data: ReadonlyArray<number | null | undefined>;
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
  key: string;
  categoryIndex: number;
  seriesIndex: number;
  xPct: number;
  yPct: number;
};

function isValidNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatDirectEndLabel(seriesLabel: string, valueText: string, maxChars: number): string {
  const suffix = ` (${valueText})`;
  const full = `${seriesLabel}${suffix}`;
  if (full.length <= maxChars) return full;
  const availableNameChars = Math.max(3, maxChars - suffix.length - 1);
  return `${seriesLabel.slice(0, availableNameChars).trimEnd()}…${suffix}`;
}

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
  const [pinnedKey, setPinnedKey] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const hitRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const uid = useId().replace(/:/g, "");
  const tableId = `${uid}-table`;
  const tooltipId = `${uid}-tooltip`;
  const instructionsId = `${uid}-instructions`;

  const safeCategories = categories.length > 0 ? categories : ["—"];
  const safeSeries: ReadonlyArray<LineChartSeries> =
    series.length > 0 ? series : [{ id: "empty", label: "Value", data: safeCategories.map(() => 0) }];

  const allVals = safeSeries.flatMap((s) =>
    safeCategories.map((_, idx) => s.data[idx]).filter(isValidNumber),
  );
  const rawMin = yMin ?? Math.min(0, ...(allVals.length ? allVals : [0]));
  const rawMax = yMax ?? Math.max(1, ...(allVals.length ? allVals : [1]));
  const [niceMin, niceMax] = niceDomain(rawMin, rawMax, 5);
  const domainMin = yMin ?? niceMin;
  const domainMax = yMax ?? niceMax;

  // Hide direct end labels at narrow widths (<360px) so small charts preserve their plot area.
  const effectiveDirectLabels = showDirectLabels && width >= 360;
  const rawLabelLengths = safeSeries.map((s) => {
    let lastVal: number | undefined;
    for (let i = safeCategories.length - 1; i >= 0; i--) {
      const v = s.data[i];
      if (isValidNumber(v)) {
        lastVal = v;
        break;
      }
    }
    return lastVal !== undefined ? `${s.label} (${formatValue(lastVal)})`.length : 0;
  });
  const longestChars = Math.max(0, ...rawLabelLengths);
  const maxRightGutter = Math.min(148, Math.round(width * 0.28));
  const estimatedRightGutter =
    effectiveDirectLabels && longestChars > 0
      ? Math.min(maxRightGutter, Math.max(76, Math.ceil(longestChars * 6.4) + 18))
      : 24;
  const maxDirectLabelChars = Math.max(10, Math.floor((estimatedRightGutter - 18) / 6.4));

  const pad = { top: 20, right: estimatedRightGutter, bottom: 36, left: 48 };
  const plotW = Math.max(60, width - pad.left - pad.right);
  const plotH = Math.max(60, height - pad.top - pad.bottom);

  const yScale = linearScale([domainMin, domainMax], [pad.top + plotH, pad.top]);
  const xAt = (idx: number) =>
    pad.left + (safeCategories.length <= 1 ? plotW / 2 : (idx / (safeCategories.length - 1)) * plotW);

  const ticks = yScale.ticks(5);

  const summaryParts = safeSeries.map((s) => {
    const validVals = safeCategories.map((_, idx) => s.data[idx]).filter(isValidNumber);
    const missingCount = safeCategories.length - validVals.length;
    if (validVals.length === 0) {
      return `${s.label} (no data)`;
    }
    const first = validVals[0];
    const last = validVals[validVals.length - 1];
    const min = Math.min(...validVals);
    const max = Math.max(...validVals);
    const missingText = missingCount > 0 ? `, ${missingCount} missing` : "";
    return `${s.label} from ${formatValue(first)} to ${formatValue(last)} (min ${formatValue(min)}, max ${formatValue(max)}${missingText})`;
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

  const hitYByCategory: Array<Map<number, number>> = safeCategories.map((_, cIdx) => {
    const validInCol: Array<{ sIdx: number; y: number }> = [];
    safeSeries.forEach((s, sIdx) => {
      const v = s.data[cIdx];
      if (isValidNumber(v)) {
        validInCol.push({ sIdx, y: yScale(v) });
      }
    });
    const separated = separateVerticalCenters(
      validInCol.map((item) => item.y),
      25,
      14,
      height - 14,
    );
    const map = new Map<number, number>();
    validInCol.forEach((item, idx) => {
      map.set(item.sIdx, separated[idx] ?? item.y);
    });
    return map;
  });

  const points: PointHit[] = [];
  safeSeries.forEach((s, sIdx) => {
    const color = s.color ?? chartColor(sIdx);
    safeCategories.forEach((cat, cIdx) => {
      const value = s.data[cIdx];
      if (!isValidNumber(value)) return;
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
        hitY: hitYByCategory[cIdx]?.get(sIdx) ?? y,
        color,
      });
    });
  });

  // Compute collision-free direct end-label vertical positions and leader anchors.
  type EndLabelDescriptor = {
    sIdx: number;
    endX: number;
    endY: number;
    labelY: number;
    text: string;
    color: string;
  };
  const rawEndLabels: Omit<EndLabelDescriptor, "labelY">[] = [];
  if (effectiveDirectLabels) {
    safeSeries.forEach((s, sIdx) => {
      for (let cIdx = safeCategories.length - 1; cIdx >= 0; cIdx--) {
        const v = s.data[cIdx];
        if (isValidNumber(v)) {
          rawEndLabels.push({
            sIdx,
            endX: xAt(cIdx),
            endY: yScale(v),
            text: formatDirectEndLabel(s.label, formatValue(v), maxDirectLabelChars),
            color: s.color ?? chartColor(sIdx),
          });
          break;
        }
      }
    });
  }
  const separatedEndLabelYs = separateVerticalCenters(
    rawEndLabels.map((item) => item.endY),
    16,
    pad.top + 6,
    pad.top + plotH - 6,
  );
  const endLabelBySeries = new Map<number, EndLabelDescriptor>();
  rawEndLabels.forEach((item, idx) => {
    endLabelBySeries.set(item.sIdx, {
      ...item,
      labelY: separatedEndLabelYs[idx] ?? item.endY,
    });
  });

  const activeFocusIndex = points.length > 0 ? Math.min(focusedIndex, points.length - 1) : 0;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "Escape") {
      setPinnedKey(null);
      setActive(null);
      return;
    }
    if (points.length === 0) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = (index + 1) % points.length;
      setFocusedIndex(next);
      hitRefs.current[next]?.focus();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const prev = (index - 1 + points.length) % points.length;
      setFocusedIndex(prev);
      hitRefs.current[prev]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      setFocusedIndex(0);
      hitRefs.current[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      const last = Math.max(0, points.length - 1);
      setFocusedIndex(last);
      hitRefs.current[last]?.focus();
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
        <span id={instructionsId} className="kl-chart__sr-only">
          Use arrow keys to navigate data points, Enter or Space to pin the tooltip, and Escape to dismiss.
        </span>
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
            const segments: Array<Array<readonly [number, number, number]>> = [];
            let currentSegment: Array<readonly [number, number, number]> = [];
            safeCategories.forEach((_, cIdx) => {
              const val = s.data[cIdx];
              if (isValidNumber(val)) {
                currentSegment.push([xAt(cIdx), yScale(val), cIdx] as const);
              } else if (currentSegment.length > 0) {
                segments.push(currentSegment);
                currentSegment = [];
              }
            });
            if (currentSegment.length > 0) {
              segments.push(currentSegment);
            }
            const validPoints = segments.flat();
            const dash = CHART_DASH_ARRAYS[sIdx % CHART_DASH_ARRAYS.length];
            const endLabel = endLabelBySeries.get(sIdx);

            return (
              <g key={s.id ?? s.label}>
                {area &&
                  segments
                    .filter((seg) => seg.length > 1)
                    .map((seg, segIdx) => {
                      const first = seg[0];
                      const last = seg[seg.length - 1];
                      const areaPath = `M ${first[0]} ${pad.top + plotH} L ${seg.map(([x, y]) => `${x} ${y}`).join(" L ")} L ${last[0]} ${pad.top + plotH} Z`;
                      return <path key={`area-${segIdx}`} d={areaPath} fill={color} fillOpacity={0.12} />;
                    })}
                {segments
                  .filter((seg) => seg.length > 1)
                  .map((seg, segIdx) => (
                    <polyline
                      key={`line-${segIdx}`}
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      strokeDasharray={dash}
                      points={seg.map(([x, y]) => `${x},${y}`).join(" ")}
                    />
                  ))}
                {validPoints.map(([cxCoord, cyCoord, cIdx]) => (
                  <ChartMarker
                    key={cIdx}
                    seriesIndex={sIdx}
                    cx={cxCoord}
                    cy={cyCoord}
                    size={4}
                    color={color}
                  />
                ))}
                {endLabel && (
                  <g>
                    <path
                      d={`M ${endLabel.endX + 5} ${endLabel.endY} L ${endLabel.endX + 9} ${endLabel.labelY} L ${endLabel.endX + 12} ${endLabel.labelY}`}
                      stroke={color}
                      className="kl-chart__leader"
                    />
                    <text
                      x={endLabel.endX + 14}
                      y={endLabel.labelY}
                      dominantBaseline="central"
                      className="kl-chart__value-label"
                    >
                      {endLabel.text}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <div className="kl-chart__overlay" role="group" aria-label={`${label} data points`}>
          {points.map((pt, idx) => {
            const xPct = (pt.x / width) * 100;
            const yPct = (pt.hitY / height) * 100;
            const isThisActive = active?.key === pt.key;
            const isThisPinned = pinnedKey === pt.key;
            const activate = () =>
              setActive({
                key: pt.key,
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
                tabIndex={idx === activeFocusIndex ? 0 : -1}
                aria-pressed={isThisPinned}
                aria-describedby={isThisActive ? `${tooltipId} ${instructionsId}` : instructionsId}
                className="kl-chart__hit kl-chart__hit--point"
                aria-label={`${pt.category}, ${pt.seriesLabel}: ${formatValue(pt.value)}`}
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
                onFocus={() => {
                  setFocusedIndex(idx);
                  if (pinnedKey !== null && pinnedKey !== pt.key) {
                    setPinnedKey(null);
                  }
                  activate();
                }}
                onBlur={() => {
                  if (pinnedKey !== pt.key) {
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
                    setPinnedKey(pt.key);
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
            items={safeSeries.map((s, sIdx) => {
              const raw = s.data[active.categoryIndex];
              return {
                label: s.label,
                value: isValidNumber(raw) ? formatValue(raw) : "No data",
                color: s.color,
                seriesIndex: sIdx,
              };
            })}
          />
        )}
      </div>

      <div id={tableId} hidden={!showData}>
        {showData && (
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
                  {safeSeries.map((s, sIdx) => {
                    const raw = s.data[cIdx];
                    return <td key={s.id ?? sIdx}>{isValidNumber(raw) ? formatValue(raw) : "No data"}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
