import { Toast as BaseToast } from "@base-ui/react/toast";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../../util";
export type ToastTone = "info" | "success" | "warning" | "danger";
export interface ToastOptions {
  id?: string;
  /** Short summary line. */
  title: ReactNode;
  /** Optional supporting detail. */
  description?: ReactNode;
  /** Status meaning: info (default), success, warning or danger. */
  tone?: ToastTone;
  /** Auto-dismiss timeout in ms (default 5000; pass 0 to keep open). */
  timeout?: number;
  /** Optional inline action button props (for example `{ children: "Undo", onClick }`). */
  actionProps?: ComponentPropsWithoutRef<"button">;
}
export interface ToastProviderProps {
  children?: ReactNode;
  /** Default auto-dismiss timeout in milliseconds (default 5000). */
  timeout?: number;
  /** Maximum simultaneous visible toasts (default 3). */
  limit?: number;
}
function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return (
    <BaseToast.Viewport className="kl-toast__viewport">
      {toasts.map((item) => {
        const tone = (item.type as ToastTone | undefined) ?? "info";
        return (
          <BaseToast.Root key={item.id} toast={item} className={cx("kl-toast", `kl-toast--${tone}`)}>
            <div className="kl-toast__body">
              {item.title && <BaseToast.Title className="kl-toast__title">{item.title}</BaseToast.Title>}
              {item.description && (
                <BaseToast.Description className="kl-toast__description">
                  {item.description}
                </BaseToast.Description>
              )}
            </div>
            <div className="kl-toast__actions">
              {item.actionProps && <BaseToast.Action className="kl-toast__action" />}
              <BaseToast.Close
                aria-hidden={false}
                className="kl-toast__close"
                aria-label="Dismiss notification"
              >
                ×
              </BaseToast.Close>
            </div>
          </BaseToast.Root>
        );
      })}
    </BaseToast.Viewport>
  );
}
/** Wraps an app or screen to display transient notifications triggered via `useToast()`. */
export function ToastProvider({ children, timeout = 5000, limit = 3 }: ToastProviderProps) {
  return (
    <BaseToast.Provider timeout={timeout} limit={limit}>
      {children}
      <BaseToast.Portal>
        <ToastList />
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}
export function useToast() {
  const manager = BaseToast.useToastManager();
  function toast({ tone = "info", ...options }: ToastOptions): string {
    return manager.add({
      ...options,
      type: tone,
      priority: tone === "danger" || tone === "warning" ? "high" : "low",
    });
  }
  return {
    toasts: manager.toasts,
    toast,
    dismiss: (id?: string) => manager.close(id),
    add: manager.add,
    close: manager.close,
    update: manager.update,
    promise: manager.promise,
  };
}
export const Toast = ToastProvider;
