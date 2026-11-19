import type { Meta, StoryObj } from "@storybook/react-vite";

const spaces = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];
const controls = ["sm", "md", "lg"];
function Space() {
  return (
    <main className="foundation">
      <h1>Space, radius, shadow, motion</h1>
      <p>A four-pixel rhythm keeps layouts consistent.</p>
      <h2>Space</h2>
      {spaces.map((n) => (
        <div key={n} className="bar-row">
          <span className="bar-name">space-{n}</span>
          <div className="bar" style={{ width: `var(--kalaa-space-${n})` }} />
        </div>
      ))}
      <h2>Control heights</h2>
      <p>Buttons, inputs and selects share three heights. Touch targets on small screens use lg (44px).</p>
      {controls.map((n) => (
        <div key={n} className="bar-row">
          <span className="bar-name">control-{n}</span>
          <div className="control-sample" style={{ height: `var(--kalaa-control-height-${n})` }} />
        </div>
      ))}
      <h2>Radius</h2>
      <p>
        Square is the default; set <code>data-shape=&quot;soft&quot;</code> for rounded corners. Both are
        shown here. <code>radius-full</code> is always 999px and is only for true circles.
      </p>
      {["square", "soft"].map((shape) => (
        <section key={shape} data-shape={shape}>
          <h3>{shape}</h3>
          <div className="grid">
            {["sm", "md", "lg", "pill", "full"].map((n) => (
              <div key={n} className="example" style={{ borderRadius: `var(--kalaa-radius-${n})` }}>
                radius-{n}
              </div>
            ))}
          </div>
        </section>
      ))}
      <h2>Shadow</h2>
      <p>
        With square corners, the 1px border carries the shape. Use shadow-2 only for floating layers (menus,
        dialogs).
      </p>
      <div className="grid">
        {[1, 2].map((n) => (
          <div key={n} className="example" style={{ boxShadow: `var(--kalaa-shadow-${n})` }}>
            Shadow {n}
          </div>
        ))}
      </div>
      <h2>Motion</h2>
      <p>
        Two durations and one easing. Under <code>prefers-reduced-motion</code> both durations become 0ms, so
        nothing animates.
      </p>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Value</th>
            <th>Use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>duration-fast</code>
            </td>
            <td>120ms</td>
            <td>Hover and focus colour changes</td>
          </tr>
          <tr>
            <td>
              <code>duration-base</code>
            </td>
            <td>200ms</td>
            <td>Popups, spinners and indicators</td>
          </tr>
          <tr>
            <td>
              <code>easing-standard</code>
            </td>
            <td>cubic-bezier(0.2, 0, 0, 1)</td>
            <td>All transitions</td>
          </tr>
        </tbody>
      </table>
      <div
        className="motion-demo"
        tabIndex={0}
        role="group"
        aria-label="Motion demo: hover or focus to move the square"
      >
        <div className="motion-square" />
      </div>
    </main>
  );
}
const meta: Meta = { title: "Foundations/Space", component: Space };
export default meta;
export const Examples: StoryObj = {};
