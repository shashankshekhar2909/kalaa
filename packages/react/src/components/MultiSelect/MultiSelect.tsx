import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { useMemo, type ComponentPropsWithRef } from "react";
import { cx } from "../../util";
export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export type MultiSelectProps = Omit<
  ComponentPropsWithRef<"input">,
  "value" | "defaultValue" | "onChange" | "size"
> & {
  /** Choices as value and label pairs. */
  options: MultiSelectOption[];
  /** Controlled array of selected option values. */
  value?: string[];
  /** Initial selected option values when uncontrolled. */
  defaultValue?: string[];
  /** Called whenever the selected values array changes. */
  onValueChange?: (value: string[]) => void;
  /** Message shown when no option matches the search query. */
  emptyMessage?: string;
  /** Marks the control invalid. */
  invalid?: boolean;
};
export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onValueChange,
  placeholder = "Filter and select…",
  emptyMessage = "No matching options",
  invalid,
  disabled,
  name,
  required,
  className,
  ...props
}: MultiSelectProps) {
  const collection = useMemo(
    () =>
      BaseCombobox.createItems(options, {
        getValue: (item) => item.value,
        getLabel: (item) => item.label,
      }),
    [options],
  );
  const labelByValue = useMemo(
    () => new Map(options.map((option) => [option.value, option.label])),
    [options],
  );
  return (
    <BaseCombobox.Root
      multiple
      items={collection}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next)}
      disabled={disabled}
      name={name}
      required={required}
    >
      <BaseCombobox.Chips
        data-invalid={invalid || Boolean(props["aria-invalid"]) || undefined}
        data-disabled={disabled || undefined}
        className={cx("kl-multi-select", className)}
      >
        <BaseCombobox.Value>
          {(selectedValues: readonly string[]) =>
            selectedValues.map((val) => {
              const chipLabel = labelByValue.get(val) ?? val;
              return (
                <BaseCombobox.Chip key={val} className="kl-multi-select__chip">
                  <span className="kl-multi-select__chip-label">{chipLabel}</span>
                  <BaseCombobox.ChipRemove
                    className="kl-multi-select__chip-remove"
                    aria-label={`Remove ${chipLabel}`}
                  >
                    ×
                  </BaseCombobox.ChipRemove>
                </BaseCombobox.Chip>
              );
            })
          }
        </BaseCombobox.Value>
        <BaseCombobox.Input
          {...props}
          placeholder={placeholder}
          aria-invalid={invalid || props["aria-invalid"]}
          className="kl-multi-select__input"
        />
      </BaseCombobox.Chips>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner className="kl-multi-select__positioner" sideOffset={4}>
          <BaseCombobox.Popup className="kl-multi-select__popup">
            <BaseCombobox.Empty className="kl-multi-select__empty">{emptyMessage}</BaseCombobox.Empty>
            <BaseCombobox.List className="kl-multi-select__list">
              {(option: MultiSelectOption) => (
                <BaseCombobox.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="kl-multi-select__item"
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
