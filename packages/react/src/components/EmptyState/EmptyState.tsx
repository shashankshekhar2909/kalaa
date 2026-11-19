import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
export type EmptyStateProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  /** What is missing, for example "No products yet". */
  title: ReactNode;
  /** What to do about it. */
  description?: ReactNode;
  /** One next step, usually a Button. */
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
