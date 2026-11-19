import { useRef, useLayoutEffect, type ComponentProps } from "react";
import { cx } from "../../util";
export interface TextareaProps extends Omit<ComponentProps<"textarea">, "size"> {
  size?: "sm" | "md";
  invalid?: boolean;
  autoResize?: boolean;
}
export function Textarea({
  invalid,
  size = "md",
  autoResize,
  className,
  rows = 3,
  ref,
  onChange,
  value,
  ...props
}: TextareaProps) {
  const local = useRef<HTMLTextAreaElement | null>(null);
  const resize = () => {
    if (autoResize && local.current) {
      local.current.style.height = "auto";
      local.current.style.height = `${local.current.scrollHeight}px`;
    }
  };
  useLayoutEffect(resize, [value, autoResize]);
  return (
    <textarea
      {...props}
      value={value}
      rows={Math.max(3, rows)}
      ref={(node) => {
        local.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      onChange={(event) => {
        resize();
        onChange?.(event);
      }}
      aria-invalid={invalid || props["aria-invalid"]}
      className={cx("kl-textarea", `kl-textarea--${size}`, className)}
    />
  );
}
