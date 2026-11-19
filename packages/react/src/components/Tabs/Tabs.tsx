import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { type ComponentProps, type ReactNode } from "react";
import { cx } from "../../util";
export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}
export interface TabsProps extends Omit<ComponentProps<"div">, "onChange"> {
  /** Tabs with their panel content. */
  items: TabItem[];
  /** Controlled selected tab. */
  value?: string;
  /** Initially selected tab when uncontrolled (default: first enabled). */
  defaultValue?: string;
  /** Called with the selected tab value. */
  onValueChange?: (value: string) => void;
  /** "segmented" (default) or "underline". */
  variant?: "segmented" | "underline";
}
export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "segmented",
  className,
  ...props
}: TabsProps) {
  return (
    <BaseTabs.Root
      {...props}
      value={value}
      defaultValue={defaultValue ?? items.find((item) => !item.disabled)?.value}
      onValueChange={(v) => {
        if (typeof v === "string") onValueChange?.(v);
      }}
      className={cx("kl-tabs", `kl-tabs--${variant}`, className)}
    >
      <BaseTabs.List className="kl-tabs__list">
        {items.map((item) => (
          <BaseTabs.Tab key={item.value} value={item.value} disabled={item.disabled} className="kl-tabs__tab">
            {item.label}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {items.map((item) => (
        <BaseTabs.Panel key={item.value} value={item.value} className="kl-tabs__panel">
          {item.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
