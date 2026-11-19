import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
export type EmptyStateProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};
export function EmptyState({ title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div {...props} className={cx("kl-empty-state", className)}>
      <h2 className="kl-empty-state__title">{title}</h2>
      {description && <p className="kl-empty-state__description">{description}</p>}
      {action}
    </div>
  );
}
