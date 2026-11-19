import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";
type Shared = { variant?: ButtonVariant; size?: ButtonSize; iconStart?: ReactNode; iconEnd?: ReactNode };
export type ButtonProps = ComponentPropsWithRef<"button"> & Shared & { loading?: boolean };
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
      {loading && <span className="kl-button__spinner" aria-hidden="true" />}
    </button>
  );
}
export type ButtonLinkProps = ComponentPropsWithRef<"a"> & Shared;
export function ButtonLink({
  variant = "secondary",
  size = "md",
  iconStart,
  iconEnd,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a {...props} className={cx("kl-button", `kl-button--${variant}`, `kl-button--${size}`, className)}>
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
    </a>
  );
}
