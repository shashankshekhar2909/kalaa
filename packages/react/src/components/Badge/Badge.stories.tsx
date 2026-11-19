import { Badge, StatusBadge } from "./Badge";

export default { title: "Components/Badge", component: Badge };
export const Neutral = { args: { children: "Draft" } };
export const Info = { args: { tone: "info", children: "Imported" } };
export const Success = { args: { tone: "success", children: "Approved" } };
export const Warning = { args: { tone: "warning", children: "Needs review" } };
export const Danger = { args: { tone: "danger", children: "Failed" } };
export const States = {
  render: () => (
    <>
      <StatusBadge status="needs review" /> <StatusBadge status="unknown status" />
    </>
  ),
};
