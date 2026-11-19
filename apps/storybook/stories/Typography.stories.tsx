import type { Meta, StoryObj } from "@storybook/react-vite";

const sizes = ["xs", "sm", "base", "md", "lg", "xl", "2xl"];
const weights = [
  ["regular", 400],
  ["medium", 500],
  ["semibold", 600],
] as const;
function Typography() {
  return (
    <main className="foundation">
      <h1>Typography</h1>
      <p>IBM Plex brings a consistent voice to interface text, headings, code and Hindi.</p>
      <h2>Scale</h2>
      {sizes.map((size) => (
        <div key={size} className="type-row" style={{ fontSize: `var(--kalaa-font-size-${size})` }}>
          <span className="type-name">{size}</span> Thoughtful tools for everyday work
        </div>
      ))}
      <h2>Weights</h2>
      {weights.map(([name, weight]) => (
        <div key={name} className="type-row" style={{ fontWeight: `var(--kalaa-font-weight-${name})` }}>
          <span className="type-name">{weight}</span> Reviewed products and pending imports
        </div>
      ))}
      <h2>Devanagari</h2>
      <p>
        IBM Plex Sans Devanagari sits behind Plex Sans in the stack, so Hindi falls through automatically.
      </p>
      {["sm", "base", "xl"].map((size) => (
        <div key={size} className="type-row" lang="hi" style={{ fontSize: `var(--kalaa-font-size-${size})` }}>
          <span className="type-name">{size}</span> सरसों का तेल 1 लीटर, कला और शिल्प
        </div>
      ))}
      {weights.map(([name, weight]) => (
        <div
          key={name}
          className="type-row"
          lang="hi"
          style={{ fontWeight: `var(--kalaa-font-weight-${name})` }}
        >
          <span className="type-name">{weight}</span> कला: सरसों का तेल
        </div>
      ))}
      <h2>Numbers</h2>
      <p>Figures are tabular by default so columns of numbers line up.</p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th className="number">Count</th>
            <th className="number">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Reviewed</td>
            <td className="number">1,234</td>
            <td className="number">₹ 245.00</td>
          </tr>
          <tr>
            <td>Pending</td>
            <td className="number">56</td>
            <td className="number">₹ 1,199.50</td>
          </tr>
        </tbody>
      </table>
      <h2>Families</h2>
      <p style={{ fontFamily: "var(--kalaa-font-sans)" }}>Sans for interface text</p>
      <p style={{ fontFamily: "var(--kalaa-font-serif)" }}>Serif for headings and brand</p>
      <p style={{ fontFamily: "var(--kalaa-font-mono)" }}>Mono for code</p>
      <h2>Line height</h2>
      <p>
        Body text uses 1.5 and headings 1.25 (<code>--kalaa-line-height-body</code>,{" "}
        <code>--kalaa-line-height-heading</code>). Devanagari needs the same 1.5 or more; do not tighten it.
      </p>
    </main>
  );
}
const meta: Meta = { title: "Foundations/Typography", component: Typography };
export default meta;
export const Scale: StoryObj = {};
