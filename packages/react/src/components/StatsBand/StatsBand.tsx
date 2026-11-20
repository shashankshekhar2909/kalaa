import type { ComponentPropsWithRef } from "react";
import type { PortfolioStat } from "../../schemas/types";
import { SectionHeader } from "../SectionHeader/SectionHeader";
import { cx } from "../../util";

export type StatsBandProps = ComponentPropsWithRef<"section"> & {
  /** Optional section heading. */
  heading?: string;
  /** Optional supporting description. */
  description?: string;
  /** Key metrics rendered with tabular numerals. */
  stats: PortfolioStat[];
  /** Section heading level (default 2). */
  headingLevel?: 2 | 3;
};

/** Horizontal metrics band displaying key figures in tabular numerals inside a semantic `<dl>`. */
export function StatsBand({
  heading,
  description,
  stats,
  headingLevel = 2,
  className,
  ...props
}: StatsBandProps) {
  return (
    <section {...props} className={cx("kl-stats-band", className)}>
      {heading && <SectionHeader title={heading} description={description} headingLevel={headingLevel} />}
      <dl className="kl-stats-band__grid">
        {stats.map((stat) => (
          <div key={stat.label} className="kl-stats-band__item">
            <dt className="kl-stats-band__label">{stat.label}</dt>
            <dd className="kl-stats-band__value">{stat.value}</dd>
            {stat.detail && <dd className="kl-stats-band__detail">{stat.detail}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
