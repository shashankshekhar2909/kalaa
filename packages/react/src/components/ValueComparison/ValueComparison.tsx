import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";

export type ValueComparisonProps = Omit<ComponentPropsWithRef<"dl">, "children"> & {
  original: ReactNode;
  proposed: ReactNode;
  originalLabel?: string;
  proposedLabel?: string;
  emptyLabel?: string;
};

export function ValueComparison({
  original,
  proposed,
  originalLabel = "Original",
  proposedLabel = "Proposed",
  emptyLabel = "No value",
  className,
  ...props
}: ValueComparisonProps) {
  return (
    <dl {...props} className={cx("kl-value-comparison", className)}>
      <div className="kl-value-comparison__item">
        <dt className="kl-value-comparison__label">{originalLabel}</dt>
        <dd className="kl-value-comparison__value">
          {original == null || original === "" ? emptyLabel : original}
        </dd>
      </div>
      <div className="kl-value-comparison__item kl-value-comparison__item--proposed">
        <dt className="kl-value-comparison__label">{proposedLabel}</dt>
        <dd className="kl-value-comparison__value">
          {proposed == null || proposed === "" ? emptyLabel : proposed}
        </dd>
      </div>
    </dl>
  );
}
