import type { ComponentPropsWithRef } from "react";
import type { PortfolioTimelineItem } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { cx } from "../../util";

export type TimelineProps = ComponentPropsWithRef<"section"> & {
  /** Optional section heading (default "Timeline"). */
  heading?: string;
  /** Chronological milestones. */
  items: PortfolioTimelineItem[];
  /** Section heading level (default 2; milestone titles render one level deeper). */
  headingLevel?: 2 | 3;
};

/** Ordered chronological timeline of career or project milestones with `<time>` dates and status badges. */
export function Timeline({
  heading = "Timeline",
  items,
  headingLevel = 2,
  className,
  ...props
}: TimelineProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  const ItemHeading = `h${headingLevel + 1}` as "h3" | "h4";
  return (
    <section {...props} className={cx("kl-timeline", className)}>
      {heading && <Heading className="kl-timeline__heading">{heading}</Heading>}
      <ol className="kl-timeline__list">
        {items.map((item, index) => {
          const isPresent = item.endDate?.toLowerCase() === "present";
          return (
            <li key={item.id ?? `${item.date}-${item.title}-${index}`} className="kl-timeline__item">
              <div className="kl-timeline__marker" aria-hidden="true" />
              <div className="kl-timeline__body">
                <div className="kl-timeline__header">
                  <div>
                    <ItemHeading className="kl-timeline__title">{item.title}</ItemHeading>
                    {item.subtitle && <p className="kl-timeline__subtitle">{item.subtitle}</p>}
                  </div>
                  <div className="kl-timeline__meta">
                    {item.badge && <Badge tone="info">{item.badge}</Badge>}
                    <span className="kl-timeline__dates">
                      <time dateTime={item.date}>{item.date}</time>
                      {item.endDate && (
                        <>
                          <span> – </span>
                          {isPresent ? (
                            <span>Present</span>
                          ) : (
                            <time dateTime={item.endDate}>{item.endDate}</time>
                          )}
                        </>
                      )}
                    </span>
                  </div>
                </div>
                {item.description && <p className="kl-timeline__description">{item.description}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
