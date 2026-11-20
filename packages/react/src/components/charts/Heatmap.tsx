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
  const hitRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tableId = `${useId().replace(/:/g, "")}-table`;

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

  function bucketLevel(v: number): 1 | 2 | 3 | 4 | 5 {
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
  const cellH = 28;
  const plotH = safeRows.length * cellH + (safeRows.length - 1) * cellGap;
  const svgH = pad.top + plotH + pad.bottom;

  const summary = `${label} (${safeRows.length} rows by ${safeCols.length} columns, total ${formatValue(sum)}, peak ${formatValue(Number.isFinite(peakVal) ? peakVal : 0)} at ${peakCell || "none"}).`;

  const totalCells = safeRows.length * safeCols.length;
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, rIdx: number, cIdx: number) {
    if (event.key === "Escape") {
      setActive(null);
      return;
    }
    const index = rIdx * safeCols.length + cIdx;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      hitRefs.current[(index + 1) % totalCells]?.focus();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      hitRefs.current[(index - 1 + totalCells) % totalCells]?.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextR = (rIdx + 1) % safeRows.length;
      hitRefs.current[nextR * safeCols.length + cIdx]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevR = (rIdx - 1 + safeRows.length) % safeRows.length;
      hitRefs.current[prevR * safeCols.length + cIdx]?.focus();
    }
  }

  const legendItems =
    ramp === "diverging"
      ? [
          { id: "1", label: "Low", color: "var(--kalaa-chart-div-1)", seriesIndex: 0 },
          { id: "2", label: "Below avg", color: "var(--kalaa-chart-div-2)", seriesIndex: 0 },
          { id: "3", label: "Neutral", color: "var(--kalaa-chart-div-3)", seriesIndex: 0 },
          { id: "4", label: "Above avg", color: "var(--kalaa-chart-div-4)", seriesIndex: 0 },
          { id: "5", label: "High", color: "var(--kalaa-chart-div-5)", seriesIndex: 0 },
        ]
      : [
          { id: "1", label: "Level 1 (low)", color: "var(--kalaa-chart-seq-1)", seriesIndex: 0 },
          { id: "2", label: "Level 2", color: "var(--kalaa-chart-seq-2)", seriesIndex: 0 },
          { id: "3", label: "Level 3", color: "var(--kalaa-chart-seq-3)", seriesIndex: 0 },
          { id: "4", label: "Level 4", color: "var(--kalaa-chart-seq-4)", seriesIndex: 0 },
          { id: "5", label: "Level 5 (high)", color: "var(--kalaa-chart-seq-5)", seriesIndex: 0 },
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

      <div className="kl-chart__stage">
        <svg
          role="img"
          aria-label={summary}
          width={width}
          height={svgH}
          viewBox={`0 0 ${width} ${svgH}`}
          className="kl-chart__svg"
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

        <div className="kl-chart__overlay">
          {safeRows.map((row, rIdx) =>
            safeCols.map((col, cIdx) => {
              const idx = rIdx * safeCols.length + cIdx;
              const x = pad.left + cIdx * (cellW + cellGap);
              const y = pad.top + rIdx * (cellH + cellGap);
              const val = values[rIdx]?.[cIdx] ?? 0;
              const level = bucketLevel(val);
              const leftPct = (x / width) * 100;
              const topPct = (y / svgH) * 100;
              const wPct = (cellW / width) * 100;
              const hPct = (cellH / svgH) * 100;
              const activate = () =>
                setActive({
                  rIdx,
                  cIdx,
                  xPct: leftPct + wPct / 2,
                  yPct: topPct,
                });
              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  ref={(el) => {
                    hitRefs.current[idx] = el;
                  }}
                  type="button"
                  className="kl-chart__hit"
                  aria-label={`${row}, ${col}: ${formatValue(val)} (level ${level} of 5)`}
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${wPct}%`,
                    height: `${hPct}%`,
                  }}
                  onFocus={activate}
                  onBlur={() => setActive(null)}
                  onMouseEnter={activate}
                  onMouseLeave={() => setActive(null)}
                  onKeyDown={(e) => handleKeyDown(e, rIdx, cIdx)}
                />
              );
            }),
          )}
        </div>

        {active !== null && (
          <ChartTooltip
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

      {showData && (
        <div id={tableId}>
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
        </div>
      )}
    </div>
  );
}
