import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";
import { cx } from "../../util";
export type TooltipSide = "top" | "bottom" | "left" | "right";
export type TooltipProps = {
  /** Brief label or keyboard shortcut shown inside the tooltip. */
  content: ReactNode;
  /** Focusable trigger element (for example a Button). */
  children: ReactElement;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the tooltip opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Preferred side relative to the trigger (default "top"). */
  side?: TooltipSide;
  /** Hover delay in milliseconds before opening (default 250). */
  delay?: number;
  /** Additional class name on the popup element. */
  className?: string;
};
export const TooltipProvider = BaseTooltip.Provider;
export function Tooltip({
  content,
  children,
  open,
  defaultOpen,
  onOpenChange,
  side = "top",
  delay = 250,
  className,
}: TooltipProps) {
  return (
    <BaseTooltip.Provider delay={delay}>
      <BaseTooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={(next) => onOpenChange?.(next)}>
        <BaseTooltip.Trigger delay={delay} render={children} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner className="kl-tooltip__positioner" side={side} sideOffset={6}>
            <BaseTooltip.Popup className={cx("kl-tooltip", className)}>{content}</BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}
