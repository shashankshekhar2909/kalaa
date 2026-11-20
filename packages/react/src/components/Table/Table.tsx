import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";

export type TableProps = ComponentPropsWithRef<"table"> & {
  caption: ReactNode;
  hideCaption?: boolean;
  scrollLabel?: string;
};

export function Table({ caption, hideCaption, scrollLabel, children, className, ...props }: TableProps) {
  return (
    <div
      className="kl-table__scroll"
      tabIndex={scrollLabel ? 0 : undefined}
      role={scrollLabel ? "region" : undefined}
      aria-label={scrollLabel}
    >
      <table {...props} className={cx("kl-table", className)}>
        <caption className={hideCaption ? "kl-table__caption--hidden" : "kl-table__caption"}>
          {caption}
        </caption>
        {children}
      </table>
    </div>
  );
}

export type TableSortHeaderProps = Omit<ComponentPropsWithRef<"th">, "scope" | "aria-sort"> & {
  direction?: "ascending" | "descending";
  onSort: () => void;
};

export function TableSortHeader({ direction, onSort, children, ...props }: TableSortHeaderProps) {
  return (
    <th {...props} scope="col" aria-sort={direction}>
      <button className="kl-table__sort" type="button" onClick={onSort}>
        {children}
        <span aria-hidden="true">
          {direction === "ascending" ? "↑" : direction === "descending" ? "↓" : "↕"}
        </span>
      </button>
    </th>
  );
}
