import type { ComponentPropsWithRef } from "react";
import { cx } from "../../util";
export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";
export type BadgeProps = ComponentPropsWithRef<"span"> & {
  /** Colour meaning: neutral (default), info, success, warning or danger. */
  tone?: BadgeTone;
};
export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return <span {...props} className={cx("kl-badge", `kl-badge--${tone}`, className)} />;
}
export const statusTone: Record<string, BadgeTone> = Object.fromEntries(
  Object.entries({
    neutral: ["found", "planned", "draft", "parked", "carried"],
    info: ["applied", "interview", "pending", "sent", "imported"],
    success: ["done", "approved", "offer", "ok", "complete"],
    warning: ["slipped", "unverified", "needs review"],
    danger: ["rejected", "failed", "unsupported"],
  }).flatMap(([tone, statuses]) => statuses.map((status) => [status, tone as BadgeTone])),
);
export type StatusBadgeProps = Omit<BadgeProps, "tone" | "children"> & {
  /** Status word such as "approved" or "needs review"; unknown words render neutral. */
  status: string;
};
export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const text = status.trim().toLowerCase();
  return (
    <Badge {...props} tone={statusTone[text] ?? "neutral"}>
      {text.charAt(0).toUpperCase() + text.slice(1)}
    </Badge>
  );
}
