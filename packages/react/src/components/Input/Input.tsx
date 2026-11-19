import { type ComponentProps } from "react";
import { cx } from "../../util";
export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  size?: "sm" | "md";
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
