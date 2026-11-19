import { type ComponentProps } from "react";
import { cx } from "../../util";
export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  /** Height: sm 30px, md 36px (default). */
  size?: "sm" | "md";
  /** Shows the danger border and sets `aria-invalid`. */
  invalid?: boolean;
}
export function Input({ size = "md", invalid, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      aria-invalid={invalid || props["aria-invalid"]}
      className={cx("kl-input", `kl-input--${size}`, className)}
    />
  );
}
