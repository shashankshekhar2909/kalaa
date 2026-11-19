import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { type ComponentProps, type ReactElement, type ReactNode } from "react";
import { cx } from "../../util";
export interface DialogProps extends Omit<ComponentProps<"div">, "title"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}
export function Dialog({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  size = "md",
  children,
  className,
  ...props
}: DialogProps) {
  return (
    <BaseDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <BaseDialog.Trigger render={trigger} />}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="kl-dialog__backdrop" />
        <BaseDialog.Viewport className="kl-dialog__viewport">
          <BaseDialog.Popup {...props} className={cx("kl-dialog", `kl-dialog--${size}`, className)}>
            <div className="kl-dialog__header">
              <BaseDialog.Title className="kl-dialog__title">{title}</BaseDialog.Title>
              <BaseDialog.Close className="kl-dialog__close" aria-label="Close">
                ×
              </BaseDialog.Close>
            </div>
            {description && (
              <BaseDialog.Description className="kl-dialog__description">
                {description}
              </BaseDialog.Description>
            )}
            <div className="kl-dialog__body">{children}</div>
            {footer && <div className="kl-dialog__footer">{footer}</div>}
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
