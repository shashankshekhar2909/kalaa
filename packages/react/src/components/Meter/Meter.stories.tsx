import { Meter } from "./Meter";

export default { title: "Components/Meter", component: Meter, tags: ["autodocs"] };

export const Scores = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", maxInlineSize: "18rem" }}>
      <Meter label="Match score" value={82} />
      <Meter label="Match score" value={0} />
      <Meter label="Match score" value={null} />
    </div>
  ),
};
