import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { chartContrastPairs, chartPalette } from "@kalaa/tokens";
import { CHART_DASH_ARRAYS, ChartMarker, ChartPatternDefs, chartColor } from "@kalaa/react";

const CATEGORICAL_NAMES: Record<string, string> = {
  "chart-1": "Chart 1 · Indigo",
  "chart-2": "Chart 2 · Ochre",
  "chart-3": "Chart 3 · Peacock teal",
  "chart-4": "Chart 4 · Plum",
  "chart-5": "Chart 5 · Gold",
  "chart-6": "Chart 6 · Cerulean cyan",
  "chart-7": "Chart 7 · Crimson rose",
  "chart-8": "Chart 8 · Moss olive",
};

function luminance(value: string) {
  const parts = value.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  const scale = value.startsWith("color(") ? 1 : 255;
  const [r, g, b] = parts.slice(0, 3).map((x) => {
    x /= scale;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function useChartContrast() {
  const scope = useRef<HTMLDivElement>(null);
  const [ratios, setRatios] = useState<Record<string, string>>({});
  useEffect(() => {
    const element = scope.current;
    if (!element) return;
    const update = () => {
      const probe = document.createElement("span");
      element.append(probe);
      const color = (role: string) => {
        probe.style.color = `var(--kalaa-${role})`;
        return getComputedStyle(probe).color;
      };
      const next: Record<string, string> = {};
      for (const [a, b] of chartContrastPairs) {
        const x = luminance(color(a));
        const y = luminance(color(b));
        next[`${a}/${b}`] = ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2);
      }
      setRatios(next);
      probe.remove();
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-accent"],
    });
    const media = matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);
  return { scope, ratios };
}

function DataVisualisation() {
  const { scope, ratios } = useChartContrast();
  return (
    <main className="foundation" ref={scope}>
      <h1>Data visualisation</h1>
      <p>
        Kalaa charts are calm, square, dependency-free React and SVG components. Every series uses tabular IBM
        Plex numerals, thin 1px reference gridlines, no gradients or 3D effects, and at least 3:1 contrast
        against surfaces in both light and dark modes.
      </p>

      <h2>Categorical palette (8 series)</h2>
      <p>
        Ordered for maximum luminance and hue separation across normal vision, protanopia, deuteranopia, and
        tritanopia. Build-time contrast checks fail if any series drops below 3.0:1 against{" "}
        <code>surface</code> or <code>bg</code>.
      </p>
      <div className="grid">
        {chartPalette.categorical.map((role, idx) => (
          <div className="card" key={role}>
            <div className="swatch" style={{ background: `var(--kalaa-${role})` }} />
            <div className="card-copy">
              <strong>{CATEGORICAL_NAMES[role] ?? role}</strong>
              <small>On surface: {ratios[`${role}/surface`] ?? "…"}:1 (needs 3:1)</small>
              <small>
                <svg width="110" height="16" viewBox="0 0 110 16" aria-hidden="true">
                  <ChartPatternDefs idPrefix={`fnd-${idx}`} count={8} />
                  <rect x="0" y="2" width="24" height="12" fill={chartColor(idx)} />
                  {idx > 0 && (
                    <rect x="0" y="2" width="24" height="12" fill={`url(#fnd-${idx}-pat-${idx})`} />
                  )}
                  <line
                    x1="34"
                    y1="8"
                    x2="96"
                    y2="8"
                    stroke={chartColor(idx)}
                    strokeWidth="2"
                    strokeDasharray={CHART_DASH_ARRAYS[idx]}
                  />
                  <ChartMarker seriesIndex={idx} cx={65} cy={8} size={4} color={chartColor(idx)} />
                </svg>
              </small>
            </div>
          </div>
        ))}
      </div>

      <h2>Sequential and diverging ramps</h2>
      <p>
        Five-step ordered tokens for heatmaps and density matrices. Every step maintains at least 3.0:1
        contrast against <code>surface</code> in light and dark themes.
      </p>
      <div className="shape-pair">
        <div className="card">
          <div className="card-copy">
            <strong>Sequential ramp (chart-seq-1 .. 5)</strong>
            <div className="ramp" style={{ marginTop: "8px" }}>
              {chartPalette.sequential.map((role) => (
                <div className="ramp-item" key={role}>
                  <div className="swatch" style={{ background: `var(--kalaa-${role})` }} />
                  <small>{role}</small>
                  <small>{ratios[`${role}/surface`] ?? "…"}:1</small>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-copy">
            <strong>Diverging ramp (chart-div-1 .. 5)</strong>
            <div className="ramp" style={{ marginTop: "8px" }}>
              {chartPalette.diverging.map((role) => (
                <div className="ramp-item" key={role}>
                  <div className="swatch" style={{ background: `var(--kalaa-${role})` }} />
                  <small>{role}</small>
                  <small>{ratios[`${role}/surface`] ?? "…"}:1</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <h2>Chart chrome roles</h2>
      <div className="grid">
        {chartPalette.roles.map((role) => (
          <div className="card" key={role}>
            <div className="swatch" style={{ background: `var(--kalaa-${role})` }} />
            <div className="card-copy">
              <strong>{role}</strong>
              <small>Token: --kalaa-{role}</small>
            </div>
          </div>
        ))}
      </div>

      <h2>Rules and accessibility</h2>
      <table>
        <thead>
          <tr>
            <th>Rule</th>
            <th>Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Never colour alone</td>
            <td>
              Bars and donut slices combine series colours with SVG hatch patterns and direct numeric labels;
              lines combine distinct stroke dash patterns, geometric markers, and end labels.
            </td>
          </tr>
          <tr>
            <td>Screen reader summary and data table</td>
            <td>
              Every chart SVG exposes <code>role=&quot;img&quot;</code> with a generated text summary and a{" "}
              <strong>Show data</strong> button that renders a Kalaa <code>Table</code>.
            </td>
          </tr>
          <tr>
            <td>Keyboard navigation</td>
            <td>
              Every data point, bar, slice, and heatmap cell is focusable by keyboard (Tab and arrow keys) and
              reveals a high-contrast <code>ChartTooltip</code>; Escape dismisses it.
            </td>
          </tr>
          <tr>
            <td>Proportion and restraint</td>
            <td>
              Cap donut charts at 6 slices (roll excess into &ldquo;Other&rdquo;), start bar axes at zero, use
              tabular numerals, and respect reduced motion.
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}

const meta: Meta = {
  title: "Foundations/Data visualisation",
  component: DataVisualisation,
};
export default meta;
export const PaletteAndRules: StoryObj = { name: "Palette and rules" };
