import { useId, useRef, useState, type ComponentPropsWithRef, type KeyboardEvent } from "react";
import { cx } from "../../util";
import { Table } from "../Table/Table";
import { ChartLegend } from "./ChartLegend";
import { ChartTooltip } from "./ChartTooltip";
import { formatChartNumber, useChartWidth } from "./scales";

export type HeatmapRamp = "sequential" | "diverging";

export type HeatmapProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** Row labels (e.g. days of the week or pipeline stages). */
  rows: ReadonlyArray<string>;
  /** Column labels (e.g. weeks or hours). */
  columns: ReadonlyArray<string>;
  /** 2D matrix of numeric values (`rows.length` × `columns.length`). */
  values: ReadonlyArray<ReadonlyArray<number>>;
  /** Accessible subject for the `role="img"` summary and data table caption. */
  label?: string;
  /** Colour ramp: `"sequential"` (default) or `"diverging"`. */
  ramp?: HeatmapRamp;
  /** Neutral midpoint for `"diverging"` ramps (default 0). */
  center?: number;
  /** Renders direct numeric labels inside cells so meaning never relies on colour alone (default true). */
  showValues?: boolean;
  /** Shows the 5-step intensity scale legend (default true). */
  showLegend?: boolean;
  /** Shows the "Show data" toggle rendering a Kalaa Table (default true). */
  showDataToggle?: boolean;
  /** Initial state of the "Show data" table (default false). */
  defaultShowData?: boolean;
  /** Custom value formatter. */
  formatValue?: (value: number) => string;
};

type ActiveCell = {
  key: string;
  rIdx: number;
  cIdx: number;
  xPct: number;
  yPct: number;
};

export function Heatmap({
  rows,
  columns,
  values,
  label = "Activity heatmap",
  ramp = "sequential",
  center = 0,
  showValues = true,
  showLegend = true,
  showDataToggle = true,
  defaultShowData = false,
  formatValue = formatChartNumber,
  className,
  ...props
}: HeatmapProps) {
  const { containerRef, width } = useChartWidth(560);
  const [showData, setShowData] = useState(defaultShowData);
  const [active, setActive] = useState<ActiveCell | null>(null);
  const [pinnedKey, setPinnedKey] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const hitRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const uid = useId().replace(/:/g, "");
  const tableId = `${uid}-table`;
  const tooltipId = `${uid}-tooltip`;
  const instructionsId = `${uid}-instructions`;

  const safeRows = rows.length > 0 ? rows : ["Row 1"];
  const safeCols = columns.length > 0 ? columns : ["Col 1"];

  const flat: number[] = [];
  let peakVal = -Infinity;
  let peakCell = "";
  let sum = 0;

  safeRows.forEach((rLabel, rIdx) => {
    safeCols.forEach((cLabel, cIdx) => {
      const v = values[rIdx]?.[cIdx] ?? 0;
      flat.push(v);
      sum += v;
      if (v > peakVal) {
        peakVal = v;
        peakCell = `${rLabel} ${cLabel}`;
      }
    });
  });

  const minVal = flat.length ? Math.min(...flat) : 0;
  const maxVal = flat.length ? Math.max(...flat) : 1;
  const span = maxVal - minVal || 1;

  const negMin = Math.min(minVal, center);
  const posMax = Math.max(maxVal, center);
  const negSpan = center - negMin;
  const posSpan = posMax - center;
  const negMid = center - negSpan / 2;
  const posMid = center + posSpan / 2;

  function bucketLevel(v: number): 1 | 2 | 3 | 4 | 5 {
    if (ramp === "diverging") {
      if (v === center) return 3;
      if (v < center) {
        if (negSpan <= 0) return 2;
        return v < negMid ? 1 : 2;
      }
      if (posSpan <= 0) return 4;
      return v <= posMid ? 4 : 5;
    }
    const norm = Math.max(0, Math.min(1, (v - minVal) / span));
    if (norm <= 0.2) return 1;
    if (norm <= 0.4) return 2;
    if (norm <= 0.6) return 3;
    if (norm <= 0.8) return 4;
    return 5;
  }

  function cellColor(level: 1 | 2 | 3 | 4 | 5): string {
    return ramp === "diverging" ? `var(--kalaa-chart-div-${level})` : `var(--kalaa-chart-seq-${level})`;
  }

  const pad = { top: 28, right: 16, bottom: 16, left: 64 };
  const plotW = Math.max(120, width - pad.left - pad.right);
  const cellGap = 3;
  const cellW = Math.max(18, (plotW - (safeCols.length - 1) * cellGap) / safeCols.length);
  const actualPlotW = safeCols.length * cellW + Math.max(0, safeCols.length - 1) * cellGap;
  const svgW = Math.max(width, Math.ceil(pad.left + actualPlotW + pad.right));
  const cellH = 28;
  const plotH = safeRows.length * cellH + (safeRows.length - 1) * cellGap;
  const svgH = pad.top + plotH + pad.bottom;

  const summary = `${label} (${safeRows.length} rows by ${safeCols.length} columns, total ${formatValue(sum)}, peak ${formatValue(Number.isFinite(peakVal) ? peakVal : 0)} at ${peakCell || "none"}).`;

  const totalCells = safeRows.length * safeCols.length;
  const activeFocusIndex = totalCells > 0 ? Math.min(focusedIndex, totalCells - 1) : 0;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, rIdx: number, cIdx: number) {
    if (event.key === "Escape") {
      setPinnedKey(null);
      setActive(null);
      return;
    }
    const index = rIdx * safeCols.length + cIdx;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = (index + 1) % totalCells;
      setFocusedIndex(next);
      hitRefs.current[next]?.focus();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prev = (index - 1 + totalCells) % totalCells;
      setFocusedIndex(prev);
      hitRefs.current[prev]?.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextR = (rIdx + 1) % safeRows.length;
      const next = nextR * safeCols.length + cIdx;
      setFocusedIndex(next);
      hitRefs.current[next]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevR = (rIdx - 1 + safeRows.length) % safeRows.length;
      const prev = prevR * safeCols.length + cIdx;
      setFocusedIndex(prev);
      hitRefs.current[prev]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      setFocusedIndex(0);
      hitRefs.current[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      const last = Math.max(0, totalCells - 1);
      setFocusedIndex(last);
      hitRefs.current[last]?.focus();
    }
  }

  const seqThresholds = [
    minVal,
    minVal + span * 0.2,
    minVal + span * 0.4,
    minVal + span * 0.6,
    minVal + span * 0.8,
    maxVal,
  ];

  const legendItems =
    ramp === "diverging"
      ? [
          {
            id: "1",
            label: `${formatValue(negMin)} to <${formatValue(negMid)}`,
            color: "var(--kalaa-chart-div-1)",
            seriesIndex: 0,
          },
          {
            id: "2",
            label: `${formatValue(negMid)} to <${formatValue(center)}`,
            color: "var(--kalaa-chart-div-2)",
            seriesIndex: 0,
          },
          {
            id: "3",
            label: `Neutral (${formatValue(center)})`,
            color: "var(--kalaa-chart-div-3)",
            seriesIndex: 0,
          },
          {
            id: "4",
            label: `>${formatValue(center)} to ${formatValue(posMid)}`,
            color: "var(--kalaa-chart-div-4)",
            seriesIndex: 0,
          },
          {
            id: "5",
            label: `>${formatValue(posMid)} to ${formatValue(posMax)}`,
            color: "var(--kalaa-chart-div-5)",
            seriesIndex: 0,
          },
        ]
      : [
          {
            id: "1",
            label: `${formatValue(seqThresholds[0])}–${formatValue(seqThresholds[1])}`,
            color: "var(--kalaa-chart-seq-1)",
            seriesIndex: 0,
          },
          {
            id: "2",
            label: `${formatValue(seqThresholds[1])}–${formatValue(seqThresholds[2])}`,
            color: "var(--kalaa-chart-seq-2)",
            seriesIndex: 0,
          },
          {
            id: "3",
            label: `${formatValue(seqThresholds[2])}–${formatValue(seqThresholds[3])}`,
            color: "var(--kalaa-chart-seq-3)",
            seriesIndex: 0,
          },
          {
            id: "4",
            label: `${formatValue(seqThresholds[3])}–${formatValue(seqThresholds[4])}`,
            color: "var(--kalaa-chart-seq-4)",
            seriesIndex: 0,
          },
          {
            id: "5",
            label: `${formatValue(seqThresholds[4])}–${formatValue(seqThresholds[5])}`,
            color: "var(--kalaa-chart-seq-5)",
            seriesIndex: 0,
          },
        ];

  return (
    <div {...props} ref={containerRef} className={cx("kl-chart", "kl-heatmap", className)}>
      {(showLegend || showDataToggle) && (
        <div className="kl-chart__toolbar">
          {showLegend ? <ChartLegend items={legendItems} aria-label="Intensity scale" /> : <span />}
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

      <div className="kl-chart__stage kl-heatmap__stage">
        <span id={instructionsId} className="kl-chart__sr-only">
          Use arrow keys to navigate heatmap cells, Enter or Space to pin the tooltip, and Escape to dismiss.
        </span>
        <div className="kl-heatmap__canvas" style={{ inlineSize: svgW, blockSize: svgH }}>
          <svg
            role="img"
            aria-label={summary}
            width={svgW}
            height={svgH}
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="kl-chart__svg"
            style={{ inlineSize: svgW, blockSize: svgH }}
          >
            {safeCols.map((col, cIdx) => {
              const x = pad.left + cIdx * (cellW + cellGap) + cellW / 2;
              return (
                <text key={col} x={x} y={pad.top - 10} textAnchor="middle" className="kl-chart__axis-label">
                  {col}
                </text>
              );
            })}

            {safeRows.map((row, rIdx) => {
              const y = pad.top + rIdx * (cellH + cellGap);
              return (
                <g key={row}>
                  <text
                    x={pad.left - 8}
                    y={y + cellH / 2}
                    textAnchor="end"
                    dominantBaseline="central"
                    className="kl-chart__axis-label"
                  >
                    {row}
                  </text>
                  {safeCols.map((col, cIdx) => {
                    const x = pad.left + cIdx * (cellW + cellGap);
                    const val = values[rIdx]?.[cIdx] ?? 0;
                    const level = bucketLevel(val);
                    const fill = cellColor(level);
                    return (
                      <g key={col}>
                        <rect
                          x={x}
                          y={y}
                          width={cellW}
                          height={cellH}
                          fill={fill}
                          stroke="var(--kalaa-surface)"
                          strokeWidth="1"
                        />
                        {showValues && (
                          <g>
                            <rect
                              x={x + cellW / 2 - 13}
                              y={y + cellH / 2 - 8}
                              width={26}
                              height={16}
                              fill="var(--kalaa-surface)"
                            />
                            <text
                              x={x + cellW / 2}
                              y={y + cellH / 2}
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="var(--kalaa-text)"
                              className="kl-heatmap__cell-text"
                            >
                              {formatValue(val)}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>

          <div className="kl-chart__overlay" role="group" aria-label={`${label} cells`}>
            {safeRows.map((row, rIdx) =>
              safeCols.map((col, cIdx) => {
                const idx = rIdx * safeCols.length + cIdx;
                const cellKey = `${rIdx}-${cIdx}`;
                const x = pad.left + cIdx * (cellW + cellGap);
                const y = pad.top + rIdx * (cellH + cellGap);
                const val = values[rIdx]?.[cIdx] ?? 0;
                const level = bucketLevel(val);
                const leftPct = (x / svgW) * 100;
                const topPct = (y / svgH) * 100;
                const wPct = (cellW / svgW) * 100;
                const hPct = (cellH / svgH) * 100;
                const isThisActive = active?.key === cellKey;
                const isThisPinned = pinnedKey === cellKey;
                const activate = () =>
                  setActive({
                    key: cellKey,
                    rIdx,
                    cIdx,
                    xPct: leftPct + wPct / 2,
                    yPct: topPct,
                  });
                return (
                  <button
                    key={cellKey}
                    ref={(el) => {
                      hitRefs.current[idx] = el;
                    }}
                    type="button"
                    tabIndex={idx === activeFocusIndex ? 0 : -1}
                    aria-pressed={isThisPinned}
                    aria-describedby={isThisActive ? `${tooltipId} ${instructionsId}` : instructionsId}
                    className="kl-chart__hit"
                    aria-label={`${row}, ${col}: ${formatValue(val)} (level ${level} of 5)`}
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      width: `${wPct}%`,
                      height: `${hPct}%`,
                    }}
                    onFocus={() => {
                      setFocusedIndex(idx);
                      if (pinnedKey !== null && pinnedKey !== cellKey) {
                        setPinnedKey(null);
                      }
                      activate();
                    }}
                    onBlur={() => {
                      if (pinnedKey !== cellKey) {
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
                        setPinnedKey(cellKey);
                        activate();
                      }
                    }}
                    onKeyDown={(e) => handleKeyDown(e, rIdx, cIdx)}
                  />
                );
              }),
            )}
          </div>

          {active !== null && (
            <ChartTooltip
              id={tooltipId}
              floating
              x={active.xPct}
              y={active.yPct}
              label={`${safeRows[active.rIdx]} · ${safeCols[active.cIdx]}`}
              items={[
                {
                  label: label,
                  value: formatValue(values[active.rIdx]?.[active.cIdx] ?? 0),
                  color: cellColor(bucketLevel(values[active.rIdx]?.[active.cIdx] ?? 0)),
                },
              ]}
            />
          )}
        </div>
      </div>

      <div id={tableId} hidden={!showData}>
        {showData && (
          <Table caption={`${label} data`}>
            <thead>
              <tr>
                <th scope="col">Row</th>
                {safeCols.map((col) => (
                  <th key={col} scope="col">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {safeRows.map((row, rIdx) => (
                <tr key={row}>
                  <th scope="row">{row}</th>
                  {safeCols.map((col, cIdx) => (
                    <td key={col}>{formatValue(values[rIdx]?.[cIdx] ?? 0)}</td>
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
