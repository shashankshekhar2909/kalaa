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
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  size?: "sm" | "md";
  invalid?: boolean;
  name?: string;
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
