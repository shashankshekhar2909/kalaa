import { StatusBadge } from "./StatusBadge";
export default { title: "Components/StatusBadge", component: StatusBadge };
export const Neutral = { args: { status: "draft" } };
export const Info = { args: { status: "imported" } };
export const Success = { args: { status: "approved" } };
export const Warning = { args: { status: "needs review" } };
export const Danger = { args: { status: "failed" } };
export const States = { args: { status: "unknown status" } };
