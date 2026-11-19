import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
const pairs: [string, string][] = [
  ["text", "bg"],
  ["text", "surface"],
  ["text-muted", "bg"],
  ["text-muted", "surface"],
  ["text-subtle", "surface"],
  ["accent", "bg"],
  ["accent", "surface"],
  ["on-accent", "accent"],
  ["accent", "accent-soft"],
  ["success", "success-soft"],
  ["warning", "warning-soft"],
  ["danger", "danger-soft"],
  ["danger", "surface"],
  ["border-strong", "surface"],
  ["focus", "bg"],
];
function luminance(value: string) {
  const rgb = value
    .match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number) ?? [0, 0, 0];
  const [r, g, b] = rgb.map((x) => {
    x /= 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function Colour() {
  const [ratios, setRatios] = useState<string[]>([]);
  useEffect(() => {
    const update = () => {
      const probe = document.createElement("span");
      document.body.append(probe);
      const color = (role: string) => {
        probe.style.color = `var(--kalaa-${role})`;
        return getComputedStyle(probe).color;
      };
      setRatios(
        pairs.map(([a, b]) => {
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
  return (
    <main className="foundation">
      <h1>Colour</h1>
      <p>Semantic roles and their contrast against paired colours in the active theme.</p>
      <div className="grid">
        {pairs.map(([role, pair], i) => (
          <div className="card" key={`${role}-${pair}`}>
            <div className="swatch" style={{ background: `var(--kalaa-${role})` }} />
            <div className="card-copy">
              <strong>{role}</strong>
              <small>
                On {pair}: {ratios[i] ?? "…"}:1
              </small>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
const meta: Meta = { title: "Foundations/Colour", component: Colour };
export default meta;
export const Roles: StoryObj = {};
