import { Select as BaseSelect } from "@base-ui/react/select";
import { type ComponentProps } from "react";
import { cx } from "../../util";
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface SelectProps extends Omit<
  ComponentProps<"button">,
  "value" | "defaultValue" | "onChange" | "size"
> {
  /** Choices as value and label pairs. */
  options: SelectOption[];
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called with the new value. */
  onValueChange?: (value: string | null) => void;
  /** Text shown when nothing is selected. */
  placeholder?: string;
  /** Height: sm 30px, md 36px (default). */
  size?: "sm" | "md";
  /** Shows the danger border and sets `aria-invalid`. */
  invalid?: boolean;
  /** Form field name. */
  name?: string;
  /** Marks the field required in forms. */
  required?: boolean;
}
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select an option",
  size = "md",
  invalid,
  className,
  disabled,
  name,
  required,
  ...props
}: SelectProps) {
  return (
    <BaseSelect.Root
      items={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      required={required}
    >
      <BaseSelect.Trigger
        {...props}
        aria-invalid={invalid || props["aria-invalid"]}
        className={cx("kl-select", `kl-select--${size}`, className)}
      >
        <BaseSelect.Value placeholder={placeholder} />
        <BaseSelect.Icon aria-hidden="true">⌄</BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className="kl-select__positioner" sideOffset={4}>
          <BaseSelect.Popup className="kl-select__popup">
            <BaseSelect.List>
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="kl-select__item"
                >
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator>✓</BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
