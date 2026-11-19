import type { ComponentPropsWithRef, ReactNode, ElementType } from "react";
import { cx } from "../../util";
export type CardProps = Omit<ComponentPropsWithRef<"section">, "title"> & {
  /** Root element (default section). */
  as?: "section" | "div" | "article";
  /** Card heading. */
  title?: ReactNode;
  /** Muted line under the title. */
  description?: ReactNode;
  /** Content on the right of the header row. */
  actions?: ReactNode;
  /** Heading level of the title (default 2). Use 3 or 4 when the card sits under a section heading. */
  titleLevel?: 2 | 3 | 4;
};
export function Card({
  as: Tag = "section",
  title,
  description,
  actions,
  titleLevel = 2,
  children,
  className,
  ...props
}: CardProps) {
  const Root: ElementType = Tag;
  const Heading = `h${titleLevel}` as "h2" | "h3" | "h4";
  return (
    <Root {...(props as ComponentPropsWithRef<"div">)} className={cx("kl-card", className)}>
      {(title || actions) && (
        <div className="kl-card__header">
          <div>
            {title && <Heading className="kl-card__title">{title}</Heading>}
            {description && <div className="kl-card__description">{description}</div>}
          </div>
          {actions}
        </div>
      )}
      {description && !title && !actions && <div className="kl-card__description">{description}</div>}
      {children}
    </Root>
  );
}
