import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
export type BannerProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  /** Meaning and colour. Warning and danger use `role="alert"`, the others `role="status"`. */
  tone: "info" | "success" | "warning" | "danger";
  /** Bold first line. */
  title?: ReactNode;
  /** Buttons on the right. */
  actions?: ReactNode;
};
export function Banner({ tone, title, actions, children, className, ...props }: BannerProps) {
  return (
    <div
      {...props}
      role={tone === "warning" || tone === "danger" ? "alert" : "status"}
      className={cx("kl-banner", `kl-banner--${tone}`, className)}
    >
      <div className="kl-banner__content">
        {title && <div className="kl-banner__title">{title}</div>}
        {children}
      </div>
      {actions && <div className="kl-banner__actions">{actions}</div>}
    </div>
  );
}
