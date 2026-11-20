import type { ComponentPropsWithRef } from "react";
import type { LandingFeatureItem } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { Card } from "../Card/Card";
import { SectionHeader } from "../SectionHeader/SectionHeader";
import { cx } from "../../util";

export type FeatureGridProps = ComponentPropsWithRef<"section"> & {
  /** Section heading. */
  heading?: string;
  /** Supporting section description. */
  description?: string;
  /** Feature items rendered as Kalaa `Card` blocks. */
  features: LandingFeatureItem[];
  /** Number of columns on desktop (default 3). */
  columns?: 2 | 3;
  /** Section heading level (default 2; feature cards render one level deeper when heading is set). */
  headingLevel?: 2 | 3;
};

/** Multi-column feature showcase composed of `SectionHeader`, Kalaa `Card` items and `Badge` tags. */
export function FeatureGrid({
  heading,
  description,
  features,
  columns = 3,
  headingLevel = 2,
  className,
  ...props
}: FeatureGridProps) {
  const cardLevel = (heading ? headingLevel + 1 : headingLevel) as 2 | 3 | 4;
  return (
    <section {...props} className={cx("kl-feature-grid", `kl-feature-grid--cols-${columns}`, className)}>
      {heading && <SectionHeader title={heading} description={description} headingLevel={headingLevel} />}
      <div className="kl-feature-grid__items">
        {features.map((feature) => (
          <Card
            key={feature.title}
            as="article"
            title={feature.title}
            titleLevel={cardLevel}
            actions={feature.badge ? <Badge tone="neutral">{feature.badge}</Badge> : undefined}
            className="kl-feature-grid__card"
          >
            <p className="kl-feature-grid__description">{feature.description}</p>
            {feature.href && (
              <div>
                <a className="kl-feature-grid__link" href={feature.href}>
                  {feature.linkLabel ?? `Explore ${feature.title.toLowerCase()}`}
                </a>
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
