import { Menu as BaseMenu } from "@base-ui/react/menu";
import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { cx } from "../../util";
export type MenuItemTone = "default" | "danger";
export type MenuEntry =
  | {
      type?: "item";
      label: ReactNode;
      onSelect?: () => void;
      icon?: ReactNode;
      tone?: MenuItemTone;
      disabled?: boolean;
    }
  | { type: "separator" };
export type MenuItemProps = Omit<ComponentPropsWithRef<"div">, "onSelect"> & {
  /** Called when the menu item is activated by click, Enter or Space. */
  onSelect?: () => void;
  /** Decorative icon before the item label. */
  icon?: ReactNode;
  /** Visual emphasis: default or danger (destructive action). */
  tone?: MenuItemTone;
  /** Disables activation while keeping the item focusable in the menu list. */
  disabled?: boolean;
};
function Item({
  onSelect,
  icon,
  tone = "default",
  disabled,
  className,
  children,
  onClick,
  ...props
}: MenuItemProps) {
  return (
    <BaseMenu.Item
      {...props}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        onSelect?.();
      }}
      className={cx("kl-menu__item", tone === "danger" && "kl-menu__item--danger", className)}
    >
      {icon && (
        <span className="kl-menu__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </BaseMenu.Item>
  );
}
function Separator({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <BaseMenu.Separator {...props} className={cx("kl-menu__separator", className)} />;
}
export type MenuProps = ComponentPropsWithRef<"div"> & {
  /** Button or element that opens the menu. */
  trigger: ReactElement;
  /** Declarative list of menu items and separators (alternatively pass `Menu.Item` children). */
  items?: MenuEntry[];
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Alignment along the trigger edge (default "start"). */
  align?: "start" | "center" | "end";
};
export function Menu({
  trigger,
  items,
  open,
  defaultOpen,
  onOpenChange,
  align = "start",
  children,
  className,
  ...props
}: MenuProps) {
  return (
    <BaseMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={(next) => onOpenChange?.(next)}>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner className="kl-menu__positioner" align={align} sideOffset={4}>
          <BaseMenu.Popup {...props} className={cx("kl-menu", className)}>
            {items
              ? items.map((entry, idx) =>
                  entry.type === "separator" ? (
                    <Separator key={idx} />
                  ) : (
                    <Item
                      key={idx}
                      icon={entry.icon}
                      tone={entry.tone}
                      disabled={entry.disabled}
                      onSelect={entry.onSelect}
                    >
                      {entry.label}
                    </Item>
                  ),
                )
              : children}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
Menu.Item = Item;
Menu.Separator = Separator;
