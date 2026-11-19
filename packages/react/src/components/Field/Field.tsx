import { Field as BaseField } from "@base-ui/react/field";
import { cloneElement, useId, type ReactElement, type ReactNode, type ComponentProps } from "react";
import { cx } from "../../util";
type ControlProps = {
  id?: string;
  required?: boolean;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-describedby"?: string;
};
export interface FieldProps extends Omit<ComponentProps<"div">, "children"> {
  /** Visible label above the control, in sentence case. */
  label: ReactNode;
  /** Help text below the control. */
  hint?: ReactNode;
  /** Error message; marks the control invalid. */
  error?: ReactNode;
  /** Adds "(required)" to the label. */
  required?: boolean;
  /** Exactly one control (Input, Textarea, Select). */
  children: ReactElement<ControlProps>;
}
export function Field({ label, hint, error, required, children, className, ...props }: FieldProps) {
  const generated = useId();
  const id = children.props.id ?? generated;
  const hintId = `${generated}-hint`;
  const errorId = `${generated}-error`;
  const described =
    [children.props["aria-describedby"], hint && hintId, error && errorId].filter(Boolean).join(" ") ||
    undefined;
  return (
    <BaseField.Root {...props} invalid={!!error} className={cx("kl-field", className)}>
      <BaseField.Label htmlFor={id} className="kl-field__label">
        {label}
        {required && " (required)"}
      </BaseField.Label>
      {cloneElement(children, {
        id,
        required: required || children.props.required,
        "aria-invalid": error ? true : children.props["aria-invalid"],
        "aria-describedby": described,
      })}
      {hint && (
        <BaseField.Description id={hintId} className="kl-field__hint">
          {hint}
        </BaseField.Description>
      )}
      {error && (
        <div id={errorId} className="kl-field__error">
          {error}
        </div>
      )}
    </BaseField.Root>
  );
}
