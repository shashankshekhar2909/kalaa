import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
export type KeyValueProps = ComponentPropsWithRef<"dl"> & {
  items: Array<{ label: ReactNode; value: ReactNode }>;
  layout?: "rows" | "grid";
};
export function KeyValue({ items, layout = "rows", className, ...props }: KeyValueProps) {
  return (
    <dl {...props} className={cx("kl-key-value", `kl-key-value--${layout}`, className)}>
      {items.map((item, i) => (
        <div className="kl-key-value__item" key={i}>
          <dt className="kl-key-value__label">{item.label}</dt>
          <dd className="kl-key-value__value">
            {item.value === null || item.value === undefined || item.value === "" ? "—" : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
