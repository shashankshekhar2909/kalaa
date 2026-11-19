import type { Meta, StoryObj } from "@storybook/react-vite";
function Space() {
  return (
    <main className="foundation">
      <h1>Space, radius, shadow</h1>
      <p>A four-pixel rhythm keeps layouts consistent.</p>
      <h2>Space</h2>
      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
        <div
          key={n}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--kalaa-space-3)",
            marginBottom: "var(--kalaa-space-2)",
          }}
        >
          <span>{n}</span>
          <div
            style={{
              height: "var(--kalaa-space-3)",
              width: `var(--kalaa-space-${n})`,
              background: "var(--kalaa-accent)",
            }}
          />
        </div>
      ))}
      <h2>Radius</h2>
      <p>Square is the default; set data-shape="soft" for rounded corners. Both are shown here.</p>
      {["square", "soft"].map((shape) => (
        <section key={shape} data-shape={shape}>
          <h3>{shape}</h3>
          <div className="grid">
            {["sm", "md", "lg", "pill", "full"].map((n) => (
              <div key={n} className="example" style={{ borderRadius: `var(--kalaa-radius-${n})` }}>
                {n}
              </div>
            ))}
          </div>
        </section>
      ))}
      <h2>Shadow</h2>
      <div className="grid">
        {[1, 2].map((n) => (
          <div key={n} className="example" style={{ boxShadow: `var(--kalaa-shadow-${n})` }}>
            Shadow {n}
          </div>
        ))}
      </div>
    </main>
  );
}
const meta: Meta = { title: "Foundations/Space, radius, shadow", component: Space };
export default meta;
export const Examples: StoryObj = {};
