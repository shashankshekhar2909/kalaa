import { Popover as BasePopover } from "@base-ui/react/popover";
import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { cx } from "../../util";
export type PopoverSide = "top" | "bottom" | "left" | "right";
export type PopoverAlign = "start" | "center" | "end";
export type PopoverProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  /** Element that opens the popover on click (usually a Button). */
  trigger?: ReactElement;
  /** Optional heading inside the popover. */
  title?: ReactNode;
  /** Optional supporting copy under the heading. */
  description?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Preferred side relative to the trigger (default "bottom"). */
  side?: PopoverSide;
  /** Alignment along the side (default "start"). */
  align?: PopoverAlign;
};
export function Popover({
  trigger,
  title,
  description,
  open,
  defaultOpen,
  onOpenChange,
  side = "bottom",
  align = "start",
  children,
  className,
  ...props
}: PopoverProps) {
  return (
    <BasePopover.Root open={open} defaultOpen={defaultOpen} onOpenChange={(next) => onOpenChange?.(next)}>
      {trigger && <BasePopover.Trigger render={trigger} />}
      <BasePopover.Portal>
        <BasePopover.Positioner className="kl-popover__positioner" side={side} align={align} sideOffset={6}>
          <BasePopover.Popup {...props} className={cx("kl-popover", className)}>
            {title && <BasePopover.Title className="kl-popover__title">{title}</BasePopover.Title>}
            {description && (
              <BasePopover.Description className="kl-popover__description">
                {description}
              </BasePopover.Description>
            )}
            <div className="kl-popover__body">{children}</div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
