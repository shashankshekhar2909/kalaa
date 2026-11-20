import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";

export type ToolbarProps = ComponentPropsWithRef<"div"> & { actions?: ReactNode };

/** Groups filters and actions while preserving ordinary Tab navigation. */
export function Toolbar({ children, actions, className, ...props }: ToolbarProps) {
  return (
    <div {...props} role="group" className={cx("kl-toolbar", className)}>
      <div className="kl-toolbar__controls">{children}</div>
      {actions != null && <div className="kl-toolbar__actions">{actions}</div>}
    </div>
  );
}
