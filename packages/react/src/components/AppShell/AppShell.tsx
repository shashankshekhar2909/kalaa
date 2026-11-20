import { useRender } from "@base-ui/react/use-render";
import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cx } from "../../util";
export type AppShellProps = ComponentPropsWithRef<"div"> & {
  /** Sidebar content, usually `AppShell.NavItem` links. */
  nav: ReactNode;
  /** Optional content above the main area (for example a page header). */
  header?: ReactNode;
  /** Brand slot at the top of the sidebar (logo, app name). Stays beside the Menu button on small screens. */
  brand?: ReactNode;
  /** Footer or utility slot at the bottom of the sidebar (theme toggle, account, sign out). */
  footer?: ReactNode;
};
export type AppShellNavItemProps = ComponentPropsWithRef<"a"> & {
  /** Decorative icon shown before the label. */
  icon?: ReactNode;
  /** Marks the current page (sets `aria-current="page"`). */
  active?: boolean;
  /**
   * Replaces the `<a>` element, for client-side routing. Pass your router's link, for example
   * `render={<NextLink href="/products" />}` with `next/link`. Kalaa props and classes are merged onto it.
   */
  render?: useRender.RenderProp;
};
const MenuContext = createContext<() => void>(() => {});
function NavItem({
  icon,
  active,
  className,
  children,
  render,
  onClick,
  ref,
  ...props
}: AppShellNavItemProps) {
  const close = useContext(MenuContext);
  return useRender({
    defaultTagName: "a",
    render,
    ref,
    props: {
      ...props,
      onClick: (event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        close();
      },
      "aria-current": active ? "page" : undefined,
      className: cx("kl-app-shell__nav-item", className),
      children: (
        <>
          {icon && <span aria-hidden="true">{icon}</span>}
          {children}
        </>
      ),
    },
  });
}
export function AppShell({ nav, header, brand, footer, children, className, ...props }: AppShellProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  return (
    <div {...props} className={cx("kl-app-shell", className)}>
      <aside
        className="kl-app-shell__sidebar"
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            setOpen(false);
            menuButton.current?.focus();
          }
        }}
      >
        <div className="kl-app-shell__sidebar-inner">
          <div className="kl-app-shell__top">
            {brand && <div className="kl-app-shell__brand">{brand}</div>}
            <button
              ref={menuButton}
              type="button"
              className="kl-app-shell__menu"
              aria-expanded={open}
              aria-controls={id}
              onClick={() => setOpen(!open)}
            >
              Menu
            </button>
          </div>
          <div id={id} className={cx("kl-app-shell__panel", open && "kl-app-shell__panel--open")}>
            <MenuContext.Provider value={() => setOpen(false)}>
              <nav aria-label="Main navigation" className="kl-app-shell__nav">
                {nav}
              </nav>
            </MenuContext.Provider>
            {footer && <div className="kl-app-shell__footer">{footer}</div>}
          </div>
        </div>
      </aside>
      <div className="kl-app-shell__body">
        {header && <div className="kl-app-shell__header">{header}</div>}
        <main className="kl-app-shell__main">{children}</main>
      </div>
    </div>
  );
}
AppShell.NavItem = NavItem;
