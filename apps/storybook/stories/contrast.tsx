import { useEffect, useRef, useState } from "react";
import { contrastPairs } from "@kalaa/tokens";

// Parses a computed "rgb(...)" or "color(srgb ...)" string into relative luminance (WCAG 2.x).
function luminance(value: string) {
  const parts = value.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  const scale = value.startsWith("color(") ? 1 : 255;
  const [r, g, b] = parts.slice(0, 3).map((x) => {
    x /= scale;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio of each pair in `contrastPairs`, measured in the computed style of the scope element (so a nested
 * data-accent wrapper reports its own values) and refreshed when the theme attributes or system scheme change. */
export function useContrastRatios() {
  const scope = useRef<HTMLDivElement>(null);
  const [ratios, setRatios] = useState<string[]>([]);
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
      setRatios(
        contrastPairs.map(([a, b]) => {
          const x = luminance(color(a)),
            y = luminance(color(b));
          return ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2);
        }),
      );
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

/** Role swatches with their contrast ratios and the required minimum. */
export function RoleGrid() {
  const { scope, ratios } = useContrastRatios();
  return (
    <div className="grid" ref={scope}>
      {contrastPairs.map(([role, pair, min], i) => (
        <div className="card" key={`${role}-${pair}`}>
          <div className="swatch" style={{ background: `var(--kalaa-${role})` }} />
          <div className="card-copy">
            <strong>{role}</strong>
            <small>
              On {pair}: {ratios[i] ?? "…"}:1 (needs {min}:1)
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
