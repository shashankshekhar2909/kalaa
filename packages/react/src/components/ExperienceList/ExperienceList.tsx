import type { ComponentPropsWithRef } from "react";
import type { ResumeExperienceItem } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { cx } from "../../util";

export type ExperienceItemProps = ComponentPropsWithRef<"article"> &
  ResumeExperienceItem & {
    /** Heading level for the role title (default 2 when standalone, 3 inside ExperienceList). */
    headingLevel?: 2 | 3 | 4;
  };

/** Single work experience entry with role, organisation, semantic `<time>` dates, impact bullets and tech tags. */
export function ExperienceItem({
  role,
  org,
  location,
  startDate,
  endDate = "Present",
  summary,
  bullets,
  tags = [],
  headingLevel = 2,
  className,
  ...props
}: ExperienceItemProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  const isPresent = endDate.toLowerCase() === "present";
  return (
    <article {...props} className={cx("kl-experience-item", className)}>
      <div className="kl-experience-item__header">
        <div>
          <Heading className="kl-experience-item__role">{role}</Heading>
          <p className="kl-experience-item__org">
            <span>{org}</span>
            {location && <span className="kl-experience-item__location"> · {location}</span>}
          </p>
        </div>
        <div className="kl-experience-item__dates">
          <time dateTime={startDate}>{startDate}</time>
          <span> – </span>
          {isPresent ? <span>Present</span> : <time dateTime={endDate}>{endDate}</time>}
        </div>
      </div>
      {summary && <p className="kl-experience-item__summary">{summary}</p>}
      {bullets.length > 0 && (
        <ul className="kl-experience-item__bullets">
          {bullets.map((bullet, index) => (
            <li key={index} className="kl-experience-item__bullet">
              {bullet}
            </li>
          ))}
        </ul>
      )}
      {tags.length > 0 && (
        <ul className="kl-experience-item__tags" aria-label={`Technologies used as ${role} at ${org}`}>
          {tags.map((tag) => (
            <li key={tag} className="kl-experience-item__tag">
              <Badge tone="neutral">{tag}</Badge>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export type ExperienceListProps = ComponentPropsWithRef<"section"> & {
  /** Section heading (default "Experience"). */
  heading?: string;
  /** Chronological experience entries. */
  items: ResumeExperienceItem[];
  /** Section heading level (default 2; items render one level deeper). */
  headingLevel?: 2 | 3;
};

/** Chronological list of work experience items with semantic `<time>` dates, bullets and tech tags. */
export function ExperienceList({
  heading = "Experience",
  items,
  headingLevel = 2,
  className,
  ...props
}: ExperienceListProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  const itemLevel = (headingLevel + 1) as 3 | 4;
  return (
    <section {...props} className={cx("kl-experience-list", className)}>
      <Heading className="kl-experience-list__heading">{heading}</Heading>
      <div className="kl-experience-list__items">
        {items.map((item) => (
          <ExperienceItem
            key={`${item.org}-${item.role}-${item.startDate}`}
            {...item}
            headingLevel={itemLevel}
          />
        ))}
      </div>
    </section>
  );
}
