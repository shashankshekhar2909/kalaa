import { useRender } from "@base-ui/react/use-render";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
import { Spinner } from "../Spinner/Spinner";
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";
type Shared = {
  /** primary (main next step), secondary (default), ghost (low emphasis) or danger (destructive). */
  variant?: ButtonVariant;
  /** Height: sm 30px, md 36px (default). */
  size?: ButtonSize;
  /** Decorative icon before the label. */
  iconStart?: ReactNode;
  /** Decorative icon after the label. */
  iconEnd?: ReactNode;
};
export type ButtonProps = ComponentPropsWithRef<"button"> &
  Shared & {
    /** Shows a spinner, disables the button and sets `aria-busy`; keeps its width. */
    loading?: boolean;
  };
export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  iconStart,
  iconEnd,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx("kl-button", `kl-button--${variant}`, `kl-button--${size}`, className)}
    >
      <span className={cx("kl-button__content", loading && "kl-button__content--loading")}>
        {iconStart && (
          <span className="kl-button__icon" aria-hidden="true">
            {iconStart}
          </span>
        )}
        {children}
        {iconEnd && (
          <span className="kl-button__icon" aria-hidden="true">
            {iconEnd}
          </span>
        )}
      </span>
      {loading && <Spinner decorative className="kl-button__spinner" />}
    </button>
  );
}
export type ButtonLinkProps = ComponentPropsWithRef<"a"> &
  Shared & {
    /**
     * Replaces the `<a>` element, for client-side routing. Pass your router's link, for example
     * `render={<NextLink href="/products" />}` with `next/link`. Kalaa props and classes are merged onto it.
     */
    render?: useRender.RenderProp;
  };
export function ButtonLink({
  variant = "secondary",
  size = "md",
  iconStart,
  iconEnd,
  className,
  children,
  render,
  ref,
  ...props
}: ButtonLinkProps) {
  return useRender({
    defaultTagName: "a",
    render,
    ref,
    props: {
      ...props,
      className: cx("kl-button", `kl-button--${variant}`, `kl-button--${size}`, className),
      children: (
        <span className="kl-button__content">
          {iconStart && (
            <span className="kl-button__icon" aria-hidden="true">
              {iconStart}
            </span>
          )}
          {children}
          {iconEnd && (
            <span className="kl-button__icon" aria-hidden="true">
              {iconEnd}
            </span>
          )}
        </span>
      ),
    },
  });
}
