import type { ComponentPropsWithRef } from "react";
import type { PortfolioAction } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { ButtonLink } from "../Button/Button";
import { cx } from "../../util";

export type SectionHeaderProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  /** Section heading text. */
  title: string;
  /** Supporting description below the heading. */
  description?: string;
  /** Optional status or category badge text. */
  badge?: string;
  /** Optional secondary action link on the right. */
  action?: PortfolioAction;
  /** Heading level (default 2). */
  headingLevel?: 2 | 3;
  /** Horizontal alignment: "between" (default) or "start". */
  align?: "between" | "start";
};

/** Section header block with semantic `h2`/`h3` title, optional badge, description and secondary action link. */
export function SectionHeader({
  title,
  description,
  badge,
  action,
  headingLevel = 2,
  align = "between",
  className,
  ...props
}: SectionHeaderProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  return (
    <div {...props} className={cx("kl-section-header", `kl-section-header--${align}`, className)}>
      <div className="kl-section-header__main">
        {badge && (
          <div className="kl-section-header__badge">
            <Badge tone="info">{badge}</Badge>
          </div>
        )}
        <Heading className="kl-section-header__title">{title}</Heading>
        {description && <p className="kl-section-header__description">{description}</p>}
      </div>
      {action && (
        <div className="kl-section-header__action">
          <ButtonLink size="sm" variant="secondary" href={action.href}>
            {action.label}
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
