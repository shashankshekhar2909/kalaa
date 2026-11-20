import { useEffect, useRef, useState } from "react";

export type LinearScale = {
  (value: number): number;
  domain: readonly [number, number];
  range: readonly [number, number];
  ticks: (count?: number) => number[];
};

export type BandScale = {
  (category: string): number;
  domain: readonly string[];
  range: readonly [number, number];
  bandwidth: number;
  step: number;
};

/** Computes nice axis bounds and tick step for a numeric domain. */
export function niceDomain(minValue: number, maxValue: number, tickCount = 5): [number, number, number] {
  const lo = Number.isFinite(minValue) ? minValue : 0;
  const hi = Number.isFinite(maxValue) ? maxValue : 1;
  const span = hi - lo;
  if (span <= 0) {
    const top = hi <= 0 ? 1 : hi;
    return [0, top, top / Math.max(1, tickCount - 1)];
  }
  const rawStep = span / Math.max(1, tickCount - 1);
  const mag = 10 ** Math.floor(Math.log10(rawStep));
  const residual = rawStep / mag;
  const niceFactor = residual > 5 ? 10 : residual > 2.5 ? 5 : residual > 2 ? 2.5 : residual > 1 ? 2 : 1;
  const step = niceFactor * mag;
  const niceMin = Math.floor(lo / step) * step;
  const niceMax = Math.ceil(hi / step) * step;
  return [niceMin, niceMax, step];
}

/** Tiny dependency-free linear scale mapping [d0, d1] to [r0, r1]. */
export function linearScale(
  domain: readonly [number, number],
  range: readonly [number, number],
): LinearScale {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0 || 1;
  const fn = ((value: number) => r0 + ((value - d0) / span) * (r1 - r0)) as LinearScale;
  fn.domain = domain;
  fn.range = range;
  fn.ticks = (count = 5) => {
    const lo = Math.min(d0, d1);
    const hi = Math.max(d0, d1);
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi <= lo) {
      return [Number.isFinite(lo) ? lo : 0];
    }
    const buildWithinDomain = (targetCount: number) => {
      const [, , step] = niceDomain(lo, hi, targetCount);
      const eps = step * 1e-6;
      const first = Math.ceil((lo - eps) / step) * step;
      const last = Math.floor((hi + eps) / step) * step;
      const out: number[] = [];
      for (let v = first; v <= last + eps; v += step) {
        const rounded = Number(v.toFixed(6));
        if (rounded >= lo - eps && rounded <= hi + eps) {
          out.push(Object.is(rounded, -0) ? 0 : rounded);
        }
      }
      return out;
    };
    const primary = buildWithinDomain(count);
    if (primary.length >= Math.max(2, count - 1)) {
      return primary;
    }
    const denser = buildWithinDomain(count + 2);
    return denser.length >= primary.length ? denser : primary;
  };
  return fn;
}

/** Tiny dependency-free band scale for categorical axes. */
export function bandScale(
  domain: readonly string[],
  range: readonly [number, number],
  padding = 0.24,
): BandScale {
  const [r0, r1] = range;
  const total = Math.abs(r1 - r0);
  const count = Math.max(1, domain.length);
  const step = total / count;
  const bandwidth = Math.max(2, step * (1 - padding));
  const offset = (step - bandwidth) / 2;
  const indexMap = new Map(domain.map((item, i) => [item, i]));
  const fn = ((category: string) => {
    const idx = indexMap.get(category) ?? 0;
    return Math.min(r0, r1) + idx * step + offset;
  }) as BandScale;
  fn.domain = domain;
  fn.range = range;
  fn.bandwidth = bandwidth;
  fn.step = step;
  return fn;
}

/** Returns the CSS custom property for the Nth categorical chart colour (0-indexed). */
export function chartColor(index: number): string {
  return `var(--kalaa-chart-${(((index % 8) + 8) % 8) + 1})`;
}

/** Stroke dash arrays for multi-series lines so series are never distinguished by colour alone. */
export const CHART_DASH_ARRAYS: readonly (string | undefined)[] = [
  undefined,
  "6 3",
  "2 3",
  "8 3 2 3",
  "10 4",
  "4 2",
  "8 3 2 3 2 3",
  "3 2",
];

/** Formats numbers cleanly with tabular figures. */
export function formatChartNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 1000 && Number.isInteger(value)) {
    return value.toLocaleString("en-US");
  }
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

/**
 * Ensures 24x24 interactive point targets within the same column never overlap (WCAG 2.2 AA target-size).
 */
export function separateVerticalCenters(
  yValues: ReadonlyArray<number>,
  minGap = 25,
  minY = 14,
  maxY = 246,
): number[] {
  const indexed = yValues.map((y, idx) => ({ idx, y })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < indexed.length; i++) {
    if (indexed[i].y < indexed[i - 1].y + minGap) {
      indexed[i].y = indexed[i - 1].y + minGap;
    }
  }
  if (indexed.length > 0 && indexed[indexed.length - 1].y > maxY) {
    indexed[indexed.length - 1].y = maxY;
    for (let i = indexed.length - 2; i >= 0; i--) {
      if (indexed[i].y > indexed[i + 1].y - minGap) {
        indexed[i].y = Math.max(minY, indexed[i + 1].y - minGap);
      }
    }
  }
  const out = new Array<number>(yValues.length);
  for (const item of indexed) {
    out[item.idx] = item.y;
  }
  return out;
}

/** SSR-safe container width hook using ResizeObserver with window resize fallback. */
export function useChartWidth(defaultWidth = 560) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(defaultWidth);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rectW = typeof el.getBoundingClientRect === "function" ? el.getBoundingClientRect().width : 0;
      const nextWidth = Math.round(el.clientWidth || rectW);
      if (nextWidth > 0) {
        setWidth(nextWidth);
      }
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const nextWidth = Math.round(entry.contentRect.width || el.clientWidth);
          if (nextWidth > 0) {
            setWidth(nextWidth);
          }
        }
      });
      observer.observe(el);
      return () => observer.disconnect();
    }
    if (typeof window !== "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
  }, []);

  return { containerRef, width };
}

/** Renders 8 SVG hatch/dot pattern defs so bar and slice series never rely on colour alone. */
export function ChartPatternDefs({ idPrefix, count = 8 }: { idPrefix: string; count?: number }) {
  const total = Math.min(8, Math.max(1, count));
  return (
    <defs>
      {Array.from({ length: total }, (_, i) => {
        const id = `${idPrefix}-pat-${i}`;
        return (
          <pattern key={id} id={id} width="8" height="8" patternUnits="userSpaceOnUse">
            {i === 1 && (
              <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="var(--kalaa-surface)" strokeWidth="1.5" />
            )}
            {i === 2 && <path d="M0,0 L8,8 M8,0 L0,8" stroke="var(--kalaa-surface)" strokeWidth="1.2" />}
            {i === 3 && <path d="M4,0 L4,8" stroke="var(--kalaa-surface)" strokeWidth="1.5" />}
            {i === 4 && <path d="M0,4 L8,4" stroke="var(--kalaa-surface)" strokeWidth="1.5" />}
            {i === 5 && <circle cx="4" cy="4" r="1.5" fill="var(--kalaa-surface)" />}
            {i === 6 && (
              <path d="M-2,6 l4,4 M0,0 l8,8 M6,-2 l4,4" stroke="var(--kalaa-surface)" strokeWidth="1.5" />
            )}
            {i === 7 && (
              <>
                <rect x="0" y="0" width="3" height="3" fill="var(--kalaa-surface)" />
                <rect x="4" y="4" width="3" height="3" fill="var(--kalaa-surface)" />
              </>
            )}
          </pattern>
        );
      })}
    </defs>
  );
}

/** Renders a distinct geometric marker per series index (circle, square, diamond, triangle, etc.). */
export function ChartMarker({
  seriesIndex,
  cx,
  cy,
  size = 4,
  color,
}: {
  seriesIndex: number;
  cx: number;
  cy: number;
  size?: number;
  color: string;
}) {
  const shape = ((seriesIndex % 8) + 8) % 8;
  const s = size;
  if (shape === 0) {
    return <circle cx={cx} cy={cy} r={s} fill={color} stroke="var(--kalaa-surface)" strokeWidth="1.5" />;
  }
  if (shape === 1) {
    return (
      <rect
        x={cx - s}
        y={cy - s}
        width={s * 2}
        height={s * 2}
        fill={color}
        stroke="var(--kalaa-surface)"
        strokeWidth="1.5"
      />
    );
  }
  if (shape === 2) {
    return (
      <polygon
        points={`${cx},${cy - s * 1.25} ${cx + s * 1.25},${cy} ${cx},${cy + s * 1.25} ${cx - s * 1.25},${cy}`}
        fill={color}
        stroke="var(--kalaa-surface)"
        strokeWidth="1.5"
      />
    );
  }
  if (shape === 3) {
    return (
      <polygon
        points={`${cx},${cy - s * 1.25} ${cx + s * 1.2},${cy + s} ${cx - s * 1.2},${cy + s}`}
        fill={color}
        stroke="var(--kalaa-surface)"
        strokeWidth="1.5"
      />
    );
  }
  if (shape === 4) {
    return (
      <polygon
        points={`${cx - s * 1.2},${cy - s} ${cx + s * 1.2},${cy - s} ${cx},${cy + s * 1.25}`}
        fill={color}
        stroke="var(--kalaa-surface)"
        strokeWidth="1.5"
      />
    );
  }
  if (shape === 5) {
    return <circle cx={cx} cy={cy} r={s} fill="var(--kalaa-surface)" stroke={color} strokeWidth="2.2" />;
  }
  if (shape === 6) {
    return (
      <rect
        x={cx - s}
        y={cy - s}
        width={s * 2}
        height={s * 2}
        fill="var(--kalaa-surface)"
        stroke={color}
        strokeWidth="2"
      />
    );
  }
  return (
    <polygon
      points={`${cx},${cy - s * 1.25} ${cx + s * 1.25},${cy} ${cx},${cy + s * 1.25} ${cx - s * 1.25},${cy}`}
      fill="var(--kalaa-surface)"
      stroke={color}
      strokeWidth="2"
    />
  );
}
