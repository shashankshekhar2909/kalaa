import { Stat } from "./Stat";
export default {
  title: "Components/Stat",
  component: Stat,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Single operational metric with a sentence-case label, tabular figure, optional status delta and comparison help line.\n\n**Do:** include the comparison window in `help` whenever you show a `delta`. **Don\'t:** colour a delta `success` or `danger` when up or down is ambiguous; keep `deltaTone="neutral"`.\n\n**Usage**\n\n```tsx\nimport { Stat } from "@kalaa/react";\n\n<Stat\n  label="Products approved"\n  value="1,284"\n  delta="+6.4%"\n  deltaTone="success"\n  help="Compared with the previous 7 days"\n/>\n```\n\nLoad the `@kalaa/tokens` CSS and fonts once at your app root (see Introduction, Installation).',
      },
    },
  },
  args: {
    label: "Products approved",
    value: "1,284",
    delta: "+6.4%",
    deltaTone: "success",
    help: "Compared with the previous 7 days",
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    delta: { control: "text" },
    deltaTone: { control: "select", options: ["neutral", "success", "warning", "danger"] },
    help: { control: "text" },
    className: { control: false },
    ref: { control: false },
  },
};
export const Default = {};
export const Tones = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "var(--kalaa-space-5)",
      }}
    >
      <Stat label="Catalog records" value="4,820" delta="No change" help="Synced 5 minutes ago" />
      <Stat label="Approved today" value="312" delta="+18%" deltaTone="success" help="Above 7-day average" />
      <Stat label="Needs review" value="29" delta="+9" deltaTone="warning" help="From morning CSV import" />
      <Stat label="Failed rows" value="4" delta="+4" deltaTone="danger" help="Missing EAN barcode" />
    </div>
  ),
};
