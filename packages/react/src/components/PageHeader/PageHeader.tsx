import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
export type PageHeaderProps = Omit<ComponentPropsWithRef<"header">, "title"> & {
  /** The page `h1`. */
  title: ReactNode;
  /** Muted line under the title. */
  description?: ReactNode;
  /** Link above the title to the parent page. */
  back?: { href: string; label: string };
  /** Buttons on the right of the title row; at most one primary. */
  actions?: ReactNode;
  /** "brand" sets the title in serif for marketing pages. */
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
