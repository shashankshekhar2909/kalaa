import type { ComponentPropsWithRef, ReactNode, ElementType } from "react";
import { cx } from "../../util";
export type CardProps = Omit<ComponentPropsWithRef<"section">, "title"> & {
  as?: "section" | "div" | "article";
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};
export function Card({
  as: Tag = "section",
  title,
  description,
  actions,
  children,
  className,
  ...props
}: CardProps) {
  const Root: ElementType = Tag;
  return (
    <Root {...(props as ComponentPropsWithRef<"div">)} className={cx("kl-card", className)}>
      {(title || actions) && (
        <div className="kl-card__header">
          <div>
            {title && <h2 className="kl-card__title">{title}</h2>}
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
