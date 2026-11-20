import {
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../util";
import { Table } from "../Table/Table";
import { ChartLegend } from "./ChartLegend";
import { ChartTooltip } from "./ChartTooltip";
import { ChartPatternDefs, chartColor, formatChartNumber } from "./scales";

export type DonutChartSlice = {
  /** Optional stable ID. */
  id?: string;
  /** Slice category label. */
  label: string;
  /** Non-negative numeric value. */
  value: number;
  /** Optional colour token; defaults to `--kalaa-chart-N`. */
  color?: string;
};

export type DonutChartProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** Slices to display (capped at 6; excess slices are grouped into "Other"). */
  data: ReadonlyArray<DonutChartSlice>;
  /** Accessible subject for the `role="img"` summary and data table caption. */
  label?: string;
  /** Caption below the centre total (default `"Total"`). */
  centerLabel?: ReactNode;
  /** Custom centre value; defaults to the formatted total of all slices. */
  centerValue?: ReactNode;
  /** Shows the legend with values and percentages (default true). */
  showLegend?: boolean;
  /** Shows direct percentage labels around the ring so meaning never relies on colour alone (default true). */
  showDirectLabels?: boolean;
  /** Overlays SVG hatch patterns on slices (default true). */
  showPatterns?: boolean;
  /** Shows the "Show data" toggle rendering a Kalaa Table (default true). */
  showDataToggle?: boolean;
  /** Initial state of the "Show data" table (default false). */
  defaultShowData?: boolean;
  /** SVG diameter in px (default 220). */
  size?: number;
  /** Ring thickness in px (default 34). */
  thickness?: number;
  /** Custom value formatter. */
  formatValue?: (value: number) => string;
};

const MAX_SLICES = 6;

function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function annularSectorPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number,
) {
  const span = Math.min(Math.PI * 2 - 0.0001, Math.max(0.0001, endAngle - startAngle));
  const eAngle = startAngle + span;
  const largeArc = span > Math.PI ? 1 : 0;
  const p1 = polarToCartesian(cx, cy, rOuter, startAngle);
  const p2 = polarToCartesian(cx, cy, rOuter, eAngle);
  const p3 = polarToCartesian(cx, cy, rInner, eAngle);
  const p4 = polarToCartesian(cx, cy, rInner, startAngle);
  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export function DonutChart({
  data,
  label = "Donut chart",
  centerLabel = "Total",
  centerValue,
  showLegend = true,
  showDirectLabels = true,
  showPatterns = true,
  showDataToggle = true,
  defaultShowData = false,
  size = 220,
  thickness = 34,
  formatValue = formatChartNumber,
  className,
  ...props
}: DonutChartProps) {
  const [showData, setShowData] = useState(defaultShowData);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const hitRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const uid = useId().replace(/:/g, "");
  const tableId = `${uid}-table`;
  const tooltipId = `${uid}-tooltip`;
  const instructionsId = `${uid}-instructions`;

  const isAggregated = data.length > MAX_SLICES;
  // Enforce max ~6 slices in the graphic by rolling excess slices into "Other".
  const normalized: DonutChartSlice[] = !isAggregated
    ? [...data]
    : [
        ...data.slice(0, MAX_SLICES - 1),
        {
          id: "other",
          label: "Other",
          value: data.slice(MAX_SLICES - 1).reduce((s, d) => s + Math.max(0, d.value), 0),
        },
      ];

  const safeData = normalized.length > 0 ? normalized : [{ id: "empty", label: "No data", value: 0 }];
  const total = safeData.reduce((sum, item) => sum + Math.max(0, item.value), 0);
  const resolvedCenter = centerValue ?? formatValue(total);

  const rawTableSource = data.length > 0 ? data : safeData;
  const tableRows = rawTableSource.map((d, idx) => {
    const val = Math.max(0, d.value);
    const pct = total > 0 ? Math.round((val / total) * 100) : 0;
    const groupedInOther = isAggregated && idx >= MAX_SLICES - 1;
    return {
      key: d.id ?? `${d.label}-${idx}`,
      label: d.label,
      val,
      pct,
      groupedInOther,
    };
  });

  const margin = showDirectLabels ? 36 : 12;
  const svgW = size + margin * 2;
  const svgH = size + margin * 2;
  const cxCoord = svgW / 2;
  const cyCoord = svgH / 2;
  const rOuter = size / 2;
  const rInner = Math.max(24, rOuter - thickness);
  const rMid = (rOuter + rInner) / 2;

  let cursorAngle = -Math.PI / 2;
  const slices = safeData.map((d, idx) => {
    const val = Math.max(0, d.value);
    const ratio = total > 0 ? val / total : 1 / safeData.length;
    const startAngle = cursorAngle;
    const endAngle = cursorAngle + ratio * Math.PI * 2;
    cursorAngle = endAngle;
    const midAngle = (startAngle + endAngle) / 2;
    const centroid = polarToCartesian(cxCoord, cyCoord, rMid, midAngle);
    const labelPos = polarToCartesian(cxCoord, cyCoord, rOuter + 14, midAngle);
    const pct = total > 0 ? Math.round((val / total) * 100) : 0;
    return {
      ...d,
      idx,
      val,
      pct,
      color: d.color ?? chartColor(idx),
      path: annularSectorPath(cxCoord, cyCoord, rOuter, rInner, startAngle, endAngle),
      centroid,
      labelPos,
    };
  });

  const summary = `${label} (total ${formatValue(total)}, ${slices.length} slices): ${slices
    .map((s) => `${s.label} ${formatValue(s.val)} (${s.pct}%)`)
    .join(", ")}.`;

  const activeFocusIndex = slices.length > 0 ? Math.min(focusedIndex, slices.length - 1) : 0;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "Escape") {
      setPinnedIndex(null);
      setActiveIndex(null);
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = (index + 1) % slices.length;
      setFocusedIndex(next);
      hitRefs.current[next]?.focus();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const prev = (index - 1 + slices.length) % slices.length;
      setFocusedIndex(prev);
      hitRefs.current[prev]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      setFocusedIndex(0);
      hitRefs.current[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      const last = Math.max(0, slices.length - 1);
      setFocusedIndex(last);
      hitRefs.current[last]?.focus();
    }
  }

  const activeSlice = activeIndex !== null ? slices[activeIndex] : undefined;

  return (
    <div {...props} className={cx("kl-chart", "kl-donut-chart", className)}>
      {showDataToggle && (
        <div className="kl-chart__toolbar">
          <span />
          <button
            type="button"
            className="kl-chart__toggle"
            aria-expanded={showData}
            aria-controls={tableId}
            onClick={() => setShowData((prev) => !prev)}
          >
            {showData ? "Hide data" : "Show data"}
          </button>
        </div>
      )}

      <div className="kl-donut-chart__layout">
        <div className="kl-chart__stage" style={{ inlineSize: svgW, maxInlineSize: "100%" }}>
          <span id={instructionsId} className="kl-chart__sr-only">
            Use arrow keys to navigate slices, Enter or Space to pin the tooltip, and Escape to dismiss.
          </span>
          <svg
            role="img"
            aria-label={summary}
            width={svgW}
            height={svgH}
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="kl-chart__svg"
          >
            {showPatterns && <ChartPatternDefs idPrefix={uid} count={8} />}

            {slices.map((s) => {
              const patIdx = ((s.idx % 8) + 8) % 8;
              return (
                <g key={s.id ?? s.label}>
                  <path d={s.path} fill={s.color} stroke="var(--kalaa-surface)" strokeWidth="2" />
                  {showPatterns && patIdx > 0 && (
                    <path
                      d={s.path}
                      fill={`url(#${uid}-pat-${patIdx})`}
                      stroke="var(--kalaa-surface)"
                      strokeWidth="2"
                    />
                  )}
                  {showDirectLabels && s.pct >= 5 && (
                    <text
                      x={s.labelPos.x}
                      y={s.labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="kl-chart__value-label"
                    >
                      {s.pct}%
                    </text>
                  )}
                </g>
              );
            })}

            <text
              x={cxCoord}
              y={cyCoord - 6}
              textAnchor="middle"
              dominantBaseline="central"
              className="kl-donut-chart__center-value"
            >
              {resolvedCenter}
            </text>
            {centerLabel && (
              <text
                x={cxCoord}
                y={cyCoord + 14}
                textAnchor="middle"
                dominantBaseline="central"
                className="kl-donut-chart__center-label"
              >
                {centerLabel}
              </text>
            )}
          </svg>

          <div className="kl-chart__overlay" role="group" aria-label={`${label} slices`}>
            {slices.map((s, idx) => {
              const xPct = (s.centroid.x / svgW) * 100;
              const yPct = (s.centroid.y / svgH) * 100;
              const isThisActive = activeIndex === idx;
              const isThisPinned = pinnedIndex === idx;
              return (
                <button
                  key={s.id ?? s.label}
                  ref={(el) => {
                    hitRefs.current[idx] = el;
                  }}
                  type="button"
                  tabIndex={idx === activeFocusIndex ? 0 : -1}
                  aria-pressed={isThisPinned}
                  aria-describedby={isThisActive ? `${tooltipId} ${instructionsId}` : instructionsId}
                  className="kl-chart__hit kl-chart__hit--point"
                  aria-label={`${s.label}: ${formatValue(s.val)} (${s.pct}%)`}
                  style={{ left: `${xPct}%`, top: `${yPct}%` }}
                  onFocus={() => {
                    setFocusedIndex(idx);
                    if (pinnedIndex !== null && pinnedIndex !== idx) {
                      setPinnedIndex(null);
                    }
                    setActiveIndex(idx);
                  }}
                  onBlur={() => {
                    if (pinnedIndex !== idx) {
                      setActiveIndex(null);
                    }
                  }}
                  onMouseEnter={() => {
                    if (pinnedIndex === null) {
                      setActiveIndex(idx);
                    }
                  }}
                  onMouseLeave={() => {
                    if (pinnedIndex === null) {
                      setActiveIndex(null);
                    }
                  }}
                  onClick={() => {
                    setFocusedIndex(idx);
                    if (isThisActive && isThisPinned) {
                      setPinnedIndex(null);
                      setActiveIndex(null);
                    } else {
                      setPinnedIndex(idx);
                      setActiveIndex(idx);
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                />
              );
            })}
          </div>

          {activeSlice && (
            <ChartTooltip
              id={tooltipId}
              floating
              x={(activeSlice.centroid.x / svgW) * 100}
              y={(activeSlice.centroid.y / svgH) * 100}
              label={activeSlice.label}
              items={[
                {
                  label: "Count",
                  value: `${formatValue(activeSlice.val)} (${activeSlice.pct}%)`,
                  color: activeSlice.color,
                  seriesIndex: activeSlice.idx,
                },
              ]}
            />
          )}
        </div>

        {showLegend && (
          <ChartLegend
            items={slices.map((s) => ({
              id: s.id ?? s.label,
              label: s.label,
              value: `${formatValue(s.val)} · ${s.pct}%`,
              color: s.color,
              seriesIndex: s.idx,
            }))}
          />
        )}
      </div>

      <div id={tableId} hidden={!showData}>
        {showData && (
          <Table caption={`${label} data`}>
            <thead>
              <tr>
                <th scope="col">Slice</th>
                <th scope="col">Value</th>
                <th scope="col">Share</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.key}>
                  <th scope="row">
                    {row.label}
                    {row.groupedInOther ? " (grouped in Other)" : ""}
                  </th>
                  <td>{formatValue(row.val)}</td>
                  <td>{row.pct}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
