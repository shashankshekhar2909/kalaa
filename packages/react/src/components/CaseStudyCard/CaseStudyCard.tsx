import type { ComponentPropsWithRef } from "react";
import type { PortfolioCaseStudy } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { ButtonLink } from "../Button/Button";
import { Card } from "../Card/Card";
import { KeyValue } from "../KeyValue/KeyValue";
import { cx } from "../../util";

export type CaseStudyCardProps = Omit<ComponentPropsWithRef<"article">, "title"> &
  PortfolioCaseStudy & {
    /** Heading level for the case study title (default 2 when standalone, 3 inside a section). */
    headingLevel?: 2 | 3 | 4;
  };

/** Portfolio case study card detailing client, `<time>` year, problem, outcome, metrics and action link. */
export function CaseStudyCard({
  title,
  client,
  year,
  summary,
  challenge,
  outcome,
  metrics = [],
  tags = [],
  href,
  ctaLabel = "Read case study",
  headingLevel = 2,
  className,
  ...props
}: CaseStudyCardProps) {
  const metaLine = (
    <span className="kl-case-study-card__meta">
      {client && <span>{client} · </span>}
      <time dateTime={year}>{year}</time>
    </span>
  );

  return (
    <Card
      {...props}
      as="article"
      title={title}
      titleLevel={headingLevel}
      description={metaLine}
      className={cx("kl-case-study-card", className)}
    >
      <p className="kl-case-study-card__summary">{summary}</p>
      {(challenge || outcome) && (
        <dl className="kl-case-study-card__narrative">
          {challenge && (
            <div className="kl-case-study-card__point">
              <dt className="kl-case-study-card__label">Challenge</dt>
              <dd className="kl-case-study-card__text">{challenge}</dd>
            </div>
          )}
          {outcome && (
            <div className="kl-case-study-card__point">
              <dt className="kl-case-study-card__label">Outcome</dt>
              <dd className="kl-case-study-card__text">{outcome}</dd>
            </div>
          )}
        </dl>
      )}
      {metrics.length > 0 && (
        <KeyValue
          layout="grid"
          items={metrics.map((metric) => ({ label: metric.label, value: metric.value }))}
        />
      )}
      {(tags.length > 0 || href) && (
        <div className="kl-case-study-card__footer">
          {tags.length > 0 && (
            <ul className="kl-case-study-card__tags" aria-label={`Tags for ${title}`}>
              {tags.map((tag) => (
                <li key={tag}>
                  <Badge tone="neutral">{tag}</Badge>
                </li>
              ))}
            </ul>
          )}
          {href && (
            <ButtonLink size="sm" variant="secondary" href={href}>
              {ctaLabel}
            </ButtonLink>
          )}
        </div>
      )}
    </Card>
  );
}
