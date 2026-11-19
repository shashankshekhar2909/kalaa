import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
export type PageHeaderProps = Omit<ComponentPropsWithRef<"header">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  back?: { href: string; label: string };
  actions?: ReactNode;
  variant?: "default" | "brand";
};
export function PageHeader({
  title,
  description,
  back,
  actions,
  variant = "default",
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header {...props} className={cx("kl-page-header", className)}>
      {back && (
        <a className="kl-page-header__back" href={back.href}>
          {back.label}
        </a>
      )}
      <div className="kl-page-header__row">
        <div>
          <h1 className={cx("kl-page-header__title", variant === "brand" && "kl-page-header__title--brand")}>
            {title}
          </h1>
          {description && <p className="kl-page-header__description">{description}</p>}
        </div>
        {actions && <div className="kl-page-header__actions">{actions}</div>}
      </div>
    </header>
  );
}
