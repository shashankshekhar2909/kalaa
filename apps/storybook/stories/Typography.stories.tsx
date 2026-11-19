import type { Meta, StoryObj } from "@storybook/react-vite";
function Typography() {
  return (
    <main className="foundation">
      <h1>Typography</h1>
      <p>IBM Plex brings a consistent voice to interface text, headings and code.</p>
      {["xs", "sm", "base", "md", "lg", "xl", "2xl"].map((size) => (
        <div
          key={size}
          style={{ fontSize: `var(--kalaa-font-size-${size})`, padding: "var(--kalaa-space-2)" }}
        >
          {size} — Thoughtful tools for everyday work
        </div>
      ))}
      <h2>Language and numbers</h2>
      <p style={{ fontSize: "var(--kalaa-font-size-xl)" }}>कला</p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th className="number">Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Reviewed</td>
            <td className="number">1,234</td>
          </tr>
          <tr>
            <td>Pending</td>
            <td className="number">56</td>
          </tr>
        </tbody>
      </table>
      <h2>Families</h2>
      <p style={{ fontFamily: "var(--kalaa-font-serif)" }}>Serif for headings</p>
      <p style={{ fontFamily: "var(--kalaa-font-mono)" }}>Mono for code</p>
    </main>
  );
}
const meta: Meta = { title: "Foundations/Typography", component: Typography };
export default meta;
export const Scale: StoryObj = {};
