import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
export type BannerProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  tone: "info" | "success" | "warning" | "danger";
  title?: ReactNode;
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
