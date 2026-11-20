import type { ComponentPropsWithRef } from "react";
import type { ResumeEducationItem } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { cx } from "../../util";

export type EducationListProps = ComponentPropsWithRef<"section"> & {
  /** Section heading (default "Education"). */
  heading?: string;
  /** Academic credentials list. */
  items: ResumeEducationItem[];
  /** Section heading level (default 2; degree titles render one level deeper). */
  headingLevel?: 2 | 3;
};

/** Academic credentials list with degree, institution, `<time>` dates, thesis details and honours badges. */
export function EducationList({
  heading = "Education",
  items,
  headingLevel = 2,
  className,
  ...props
}: EducationListProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  const ItemHeading = `h${headingLevel + 1}` as "h3" | "h4";
  return (
    <section {...props} className={cx("kl-education-list", className)}>
      <Heading className="kl-education-list__heading">{heading}</Heading>
      <div className="kl-education-list__items">
        {items.map((item) => (
          <article
            key={`${item.institution}-${item.degree}-${item.endDate}`}
            className="kl-education-list__item"
          >
            <div className="kl-education-list__header">
              <div>
                <ItemHeading className="kl-education-list__degree">{item.degree}</ItemHeading>
                <p className="kl-education-list__institution">
                  <span>{item.institution}</span>
                  {item.location && <span> · {item.location}</span>}
                </p>
              </div>
              <div className="kl-education-list__dates">
                {item.startDate && (
                  <>
                    <time dateTime={item.startDate}>{item.startDate}</time>
                    <span> – </span>
                  </>
                )}
                <time dateTime={item.endDate}>{item.endDate}</time>
              </div>
            </div>
            {item.details && <p className="kl-education-list__details">{item.details}</p>}
            {item.honors && item.honors.length > 0 && (
              <ul className="kl-education-list__honors" aria-label={`Honours for ${item.degree}`}>
                {item.honors.map((honor) => (
                  <li key={honor} className="kl-education-list__honor">
                    <Badge tone="info">{honor}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
