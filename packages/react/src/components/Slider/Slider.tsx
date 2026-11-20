import { Slider as BaseSlider } from "@base-ui/react/slider";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
export type SliderProps = Omit<ComponentPropsWithRef<"div">, "defaultValue" | "onChange"> & {
  /** Visible label associated with the slider thumb. */
  label?: ReactNode;
  /** Controlled numeric value. */
  value?: number;
  /** Initial value when uncontrolled (default 0). */
  defaultValue?: number;
  /** Called as the slider thumb moves. */
  onValueChange?: (value: number) => void;
  /** Minimum value (default 0). */
  min?: number;
  /** Maximum value (default 100). */
  max?: number;
  /** Step increment (default 1). */
  step?: number;
  /** Shows the formatted numeric value opposite the label (default true when `label` is set). */
  showValue?: boolean;
  /** Number format options passed to `Intl.NumberFormat`. */
  format?: Intl.NumberFormatOptions;
  /** Disables interaction. */
  disabled?: boolean;
  /** Form field name. */
  name?: string;
};
export function Slider({
  label,
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = Boolean(label),
  format,
  disabled,
  name,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: SliderProps) {
  return (
    <BaseSlider.Root
      {...props}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (typeof next === "number") onValueChange?.(next);
      }}
      min={min}
      max={max}
      step={step}
      format={format}
      disabled={disabled}
      name={name}
      className={cx("kl-slider", className)}
    >
      {(label || showValue) && (
        <div className="kl-slider__header">
          {label && <BaseSlider.Label className="kl-slider__label">{label}</BaseSlider.Label>}
          {showValue && <BaseSlider.Value className="kl-slider__value" />}
        </div>
      )}
      <BaseSlider.Control className="kl-slider__control">
        <BaseSlider.Track className="kl-slider__track">
          <BaseSlider.Indicator className="kl-slider__indicator" />
          <BaseSlider.Thumb
            aria-label={!label ? ariaLabel : undefined}
            aria-labelledby={!label ? ariaLabelledBy : undefined}
            className="kl-slider__thumb"
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
