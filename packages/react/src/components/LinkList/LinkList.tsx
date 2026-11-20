import type { ComponentPropsWithRef } from "react";
import type { PortfolioLinkItem } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { cx } from "../../util";

export type LinkListProps = ComponentPropsWithRef<"section"> & {
  /** Optional section heading. */
  heading?: string;
  /** Annotated links to render. */
  items: PortfolioLinkItem[];
  /** Visual variant: "stacked" (default, with descriptions) or "inline" (compact horizontal bar). */
  variant?: "stacked" | "inline";
  /** Section heading level (default 2). */
  headingLevel?: 2 | 3;
};

/** Annotated list of links for writing, talks, repositories or profile directories. */
export function LinkList({
  heading,
  items,
  variant = "stacked",
  headingLevel = 2,
  className,
  ...props
}: LinkListProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  return (
    <section {...props} className={cx("kl-link-list", `kl-link-list--${variant}`, className)}>
      {heading && <Heading className="kl-link-list__heading">{heading}</Heading>}
      <ul className="kl-link-list__items">
        {items.map((item) => (
          <li key={`${item.label}-${item.href}`} className="kl-link-list__item">
            <div className="kl-link-list__row">
              <a className="kl-link-list__link" href={item.href}>
                {item.label}
              </a>
              {item.meta && <Badge tone="neutral">{item.meta}</Badge>}
            </div>
            {item.description && variant === "stacked" && (
              <p className="kl-link-list__description">{item.description}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
