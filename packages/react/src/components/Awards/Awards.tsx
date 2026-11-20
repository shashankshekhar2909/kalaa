import type { ComponentPropsWithRef } from "react";
import type { ResumeAwardItem } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { cx } from "../../util";

export type AwardsProps = ComponentPropsWithRef<"section"> & {
  /** Section heading (default "Awards & publications"). */
  heading?: string;
  /** Award and publication entries. */
  items: ResumeAwardItem[];
  /** Section heading level (default 2; entry titles render one level deeper). */
  headingLevel?: 2 | 3;
};

/** Honours, awards and peer-reviewed publications list with `<time>` dates, issuer details and category badges. */
export function Awards({
  heading = "Awards & publications",
  items,
  headingLevel = 2,
  className,
  ...props
}: AwardsProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  const ItemHeading = `h${headingLevel + 1}` as "h3" | "h4";
  return (
    <section {...props} className={cx("kl-awards", className)}>
      <Heading className="kl-awards__heading">{heading}</Heading>
      <div className="kl-awards__items">
        {items.map((item) => (
          <article key={`${item.title}-${item.date}`} className="kl-awards__item">
            <div className="kl-awards__header">
              <div className="kl-awards__title-group">
                <ItemHeading className="kl-awards__title">
                  {item.href ? (
                    <a className="kl-awards__link" href={item.href}>
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </ItemHeading>
                <p className="kl-awards__issuer">{item.issuer}</p>
              </div>
              <div className="kl-awards__meta">
                {item.kind && (
                  <Badge tone={item.kind === "publication" ? "info" : "neutral"}>
                    {item.kind === "publication" ? "Publication" : "Award"}
                  </Badge>
                )}
                <time className="kl-awards__date" dateTime={item.date}>
                  {item.date}
                </time>
              </div>
            </div>
            {item.summary && <p className="kl-awards__summary">{item.summary}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

export type PublicationsProps = AwardsProps;

/** Convenience wrapper around `Awards` defaulted to the "Publications" heading. */
export function Publications({ heading = "Publications", ...props }: PublicationsProps) {
  return <Awards heading={heading} {...props} />;
}
