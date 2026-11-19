import { ProgressBar } from "./ProgressBar";

export default { title: "Components/ProgressBar", component: ProgressBar };
export const Accent = { args: { label: "Import progress", value: 45 } };
export const Success = { args: { label: "Import complete", value: 100, tone: "success" } };
export const Warning = { args: { label: "Review progress", value: 60, tone: "warning" } };
export const Danger = { args: { label: "Failed imports", value: 20, tone: "danger" } };
export const States = { args: { label: "Import progress", value: 0, hideLabel: true } };
