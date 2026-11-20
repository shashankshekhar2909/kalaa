import type { ComponentPropsWithRef } from "react";
import { Button } from "../Button/Button";
import { cx } from "../../util";

export type PaginationProps = Omit<ComponentPropsWithRef<"nav">, "children"> & {
  /** Current page, starting at 1. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
  emptyLabel?: string;
  formatPage?: (page: number, pageCount: number) => string;
};

const defaultFormatPage = (page: number, pageCount: number) => `Page ${page} of ${pageCount}`;

export function Pagination({
  page,
  pageCount,
  onPageChange,
  previousLabel = "Previous",
  nextLabel = "Next",
  emptyLabel = "No pages",
  formatPage = defaultFormatPage,
  className,
  "aria-label": label = "Pagination",
  ...props
}: PaginationProps) {
  const current = pageCount > 0 ? Math.max(1, Math.min(page, pageCount)) : 0;

  return (
    <nav {...props} aria-label={label} className={cx("kl-pagination", className)}>
      <Button size="sm" disabled={current <= 1} onClick={() => onPageChange(current - 1)}>
        {previousLabel}
      </Button>
      <span role="status">{current === 0 ? emptyLabel : formatPage(current, pageCount)}</span>
      <Button
        size="sm"
        disabled={current === 0 || current >= pageCount}
        onClick={() => onPageChange(current + 1)}
      >
        {nextLabel}
      </Button>
    </nav>
  );
}
