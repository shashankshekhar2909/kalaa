import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { useMemo, type ComponentPropsWithRef } from "react";
import { cx } from "../../util";
export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export type ComboboxProps = Omit<
  ComponentPropsWithRef<"input">,
  "value" | "defaultValue" | "onChange" | "size"
> & {
  /** Choices as value and label pairs. */
  options: ComboboxOption[];
  /** Controlled selected value. */
  value?: string | null;
  /** Initial value when uncontrolled. */
  defaultValue?: string | null;
  /** Called when the selected value changes. */
  onValueChange?: (value: string | null) => void;
  /** Message shown when no option matches the search query. */
  emptyMessage?: string;
  /** Height: sm 30px, md 36px (default). */
  size?: "sm" | "md";
  /** Marks the control invalid. */
  invalid?: boolean;
};
export function Combobox({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Search options…",
  emptyMessage = "No matching options",
  size = "md",
  invalid,
  disabled,
  name,
  required,
  className,
  ...props
}: ComboboxProps) {
  const collection = useMemo(
    () =>
      BaseCombobox.createItems(options, {
        getValue: (item) => item.value,
        getLabel: (item) => item.label,
      }),
    [options],
  );
  return (
    <BaseCombobox.Root
      items={collection}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next ?? null)}
      disabled={disabled}
      name={name}
      required={required}
    >
      <div className="kl-combobox__control">
        <BaseCombobox.Input
          {...props}
          placeholder={placeholder}
          aria-invalid={invalid || props["aria-invalid"]}
          className={cx("kl-combobox__input", `kl-combobox__input--${size}`, className)}
        />
        <BaseCombobox.Trigger
          className="kl-combobox__trigger"
          tabIndex={-1}
          aria-label="Toggle options"
          disabled={disabled}
        >
          ⌄
        </BaseCombobox.Trigger>
      </div>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner className="kl-combobox__positioner" sideOffset={4}>
          <BaseCombobox.Popup className="kl-combobox__popup">
            <BaseCombobox.Empty className="kl-combobox__empty">{emptyMessage}</BaseCombobox.Empty>
            <BaseCombobox.List className="kl-combobox__list">
              {(option: ComboboxOption) => (
                <BaseCombobox.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="kl-combobox__item"
                >
                  <span>{option.label}</span>
                  <BaseCombobox.ItemIndicator>✓</BaseCombobox.ItemIndicator>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}
