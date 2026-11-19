import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { type ComponentProps, type ReactElement, type ReactNode } from "react";
import { cx } from "../../util";
export interface DialogProps extends Omit<ComponentProps<"div">, "title"> {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the dialog (usually a Button). */
  trigger?: ReactElement;
  /** Dialog heading; also its accessible name. */
  title: ReactNode;
  /** Short explanation under the title. */
  description?: ReactNode;
  /** Actions row, for example Cancel and Save. */
  footer?: ReactNode;
  /** Width: sm 400px, md 560px (default), lg 720px. */
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
