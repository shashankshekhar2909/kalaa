import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cx } from "../../util";
export interface SwitchProps extends Omit<ComponentProps<typeof BaseSwitch.Root>, "className" | "children"> {
  /** Visible label, shown to the right of the switch. */
  label: ReactNode;
  /** Optional help text under the label, linked with `aria-describedby`. */
  description?: ReactNode;
  className?: string;
}
export function Switch({ label, description, className, id, ...props }: SwitchProps) {
  const generated = useId();
  const controlId = id ?? generated;
  return (
    <div className="kl-switch__group">
      <BaseSwitch.Root
        {...props}
        id={controlId}
        aria-describedby={description ? `${controlId}-description` : undefined}
        className={cx("kl-switch", className)}
      >
        <BaseSwitch.Thumb className="kl-switch__thumb" />
      </BaseSwitch.Root>
      <div>
        <label className="kl-switch__label" htmlFor={controlId}>
          {label}
        </label>
        {description && (
          <div id={`${controlId}-description`} className="kl-switch__description">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
