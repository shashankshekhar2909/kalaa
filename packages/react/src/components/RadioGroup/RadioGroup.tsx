import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { cx } from "../../util";
export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}
export type RadioGroupProps = Omit<ComponentPropsWithRef<"div">, "defaultValue" | "onChange"> & {
  /** Choices in the radio group. */
  options: RadioOption[];
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value when uncontrolled. */
  defaultValue?: string;
  /** Called when the selected radio changes. */
  onValueChange?: (value: string) => void;
  /** Layout direction: vertical (default) or horizontal. */
  orientation?: "vertical" | "horizontal";
  /** Disables every option in the group. */
  disabled?: boolean;
  /** Form field name. */
  name?: string;
  /** Marks a selection required in forms. */
  required?: boolean;
};
export function RadioGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  orientation = "vertical",
  disabled,
  name,
  required,
  className,
  ...props
}: RadioGroupProps) {
  const groupId = useId();
  return (
    <BaseRadioGroup
      {...props}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(String(next))}
      disabled={disabled}
      name={name}
      required={required}
      className={cx("kl-radio-group", `kl-radio-group--${orientation}`, className)}
    >
      {options.map((option) => {
        const itemId = `${groupId}-${option.value}`;
        return (
          <div key={option.value} className="kl-radio-group__item">
            <BaseRadio.Root
              id={itemId}
              value={option.value}
              disabled={option.disabled}
              aria-describedby={option.description ? `${itemId}-description` : undefined}
              className="kl-radio"
            >
              <BaseRadio.Indicator className="kl-radio__indicator" />
            </BaseRadio.Root>
            <div>
              <label className="kl-radio__label" htmlFor={itemId}>
                {option.label}
              </label>
              {option.description && (
                <div id={`${itemId}-description`} className="kl-radio__description">
                  {option.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </BaseRadioGroup>
  );
}
