import { useRender } from "@base-ui/react/use-render";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
export interface BreadcrumbItem {
  /** Visible text for this step. */
  label: ReactNode;
  /** Destination URL; omit on the final item to render plain text for the current page. */
  href?: string;
  /**
   * Replaces the `<a>` element for client-side routing, for example
   * `render: <NextLink href="/products" />` with `next/link`.
   */
  render?: useRender.RenderProp;
}
export type BreadcrumbsProps = Omit<ComponentPropsWithRef<"nav">, "children"> & {
  /** Trail from root to the current page. */
  items: BreadcrumbItem[];
  /** Accessible name for the `<nav>` landmark (default "Breadcrumb"). */
  label?: string;
};
function CrumbLink({ item, isCurrent }: { item: BreadcrumbItem; isCurrent: boolean }) {
  return useRender({
    defaultTagName: "a",
    render: item.render,
    props: {
      href: item.href,
      "aria-current": isCurrent ? "page" : undefined,
      className: "kl-breadcrumbs__link",
      children: item.label,
    },
  });
}
export function Breadcrumbs({ items, label = "Breadcrumb", className, ...props }: BreadcrumbsProps) {
  return (
    <nav {...props} aria-label={label} className={cx("kl-breadcrumbs", className)}>
      <ol className="kl-breadcrumbs__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isLink = Boolean(item.href || item.render);
          return (
            <li key={index} className="kl-breadcrumbs__item">
              {index > 0 && (
                <span aria-hidden="true" className="kl-breadcrumbs__separator">
                  /
                </span>
              )}
              {isLink ? (
                <CrumbLink item={item} isCurrent={isLast} />
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="kl-breadcrumbs__current">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
