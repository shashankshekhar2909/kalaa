import { useId, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { cx } from "../../util";
export type AppShellProps = ComponentPropsWithRef<"div"> & {
  /** Sidebar content, usually `AppShell.NavItem` links. */
  nav: ReactNode;
  /** Optional content above the main area (for example a page header). */
  header?: ReactNode;
};
export type AppShellNavItemProps = ComponentPropsWithRef<"a"> & {
  /** Decorative icon shown before the label. */
  icon?: ReactNode;
  /** Marks the current page (sets `aria-current="page"`). */
  active?: boolean;
};
function NavItem({ icon, active, className, children, ...props }: AppShellNavItemProps) {
  return (
    <a
      {...props}
      aria-current={active ? "page" : undefined}
      className={cx("kl-app-shell__nav-item", className)}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </a>
  );
}
export function AppShell({ nav, header, children, className, ...props }: AppShellProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div {...props} className={cx("kl-app-shell", className)}>
      <aside className="kl-app-shell__sidebar">
        <button
          type="button"
          className="kl-app-shell__menu"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
        <nav
          id={id}
          aria-label="Main navigation"
          className={cx("kl-app-shell__nav", open && "kl-app-shell__nav--open")}
        >
          {nav}
        </nav>
      </aside>
      <div className="kl-app-shell__body">
        {header && <div className="kl-app-shell__header">{header}</div>}
        <main className="kl-app-shell__main">{children}</main>
      </div>
    </div>
  );
}
AppShell.NavItem = NavItem;
