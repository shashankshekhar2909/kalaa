import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cx } from "../../util";
export interface CheckboxProps extends Omit<
  ComponentProps<typeof BaseCheckbox.Root>,
  "className" | "children"
> {
  /** Visible label, shown to the right of the box. */
  label: ReactNode;
  /** Optional help text under the label, linked with `aria-describedby`. */
  description?: ReactNode;
  className?: string;
}
export function Checkbox({ label, description, className, id, ...props }: CheckboxProps) {
  const generated = useId();
  const controlId = id ?? generated;
  return (
    <div className="kl-checkbox__group">
      <BaseCheckbox.Root
        {...props}
        id={controlId}
        aria-describedby={description ? `${controlId}-description` : undefined}
        className={cx("kl-checkbox", className)}
      >
        <BaseCheckbox.Indicator className="kl-checkbox__indicator">
          {props.indeterminate ? "−" : "✓"}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      <div>
        <label className="kl-checkbox__label" htmlFor={controlId}>
          {label}
        </label>
        {description && (
          <div id={`${controlId}-description`} className="kl-checkbox__description">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
