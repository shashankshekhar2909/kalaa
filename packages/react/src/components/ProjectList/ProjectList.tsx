import type { ComponentPropsWithRef } from "react";
import type { ResumeProjectItem } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { Card } from "../Card/Card";
import { KeyValue } from "../KeyValue/KeyValue";
import { cx } from "../../util";

export type ProjectCardProps = Omit<ComponentPropsWithRef<"article">, "title"> &
  ResumeProjectItem & {
    /** Heading level for the project title (default 2 when standalone, 3 inside ProjectList). */
    headingLevel?: 2 | 3 | 4;
  };

/** Single project card with description, role, `<time>` dates, quantified impact numbers, tech tags and links. */
export function ProjectCard({
  name,
  description,
  role,
  startDate,
  endDate,
  impact = [],
  tags = [],
  links = [],
  headingLevel = 2,
  className,
  ...props
}: ProjectCardProps) {
  const datePart = startDate ? (
    <span className="kl-project-card__dates">
      <time dateTime={startDate}>{startDate}</time>
      {endDate && (
        <>
          <span> – </span>
          {endDate.toLowerCase() === "present" ? (
            <span>Present</span>
          ) : (
            <time dateTime={endDate}>{endDate}</time>
          )}
        </>
      )}
    </span>
  ) : null;

  const subtitle =
    role || datePart ? (
      <span className="kl-project-card__meta">
        {role && <span>{role}</span>}
        {role && datePart && <span> · </span>}
        {datePart}
      </span>
    ) : undefined;

  return (
    <Card
      {...props}
      as="article"
      title={name}
      titleLevel={headingLevel}
      description={subtitle}
      className={cx("kl-project-card", className)}
    >
      <p className="kl-project-card__description">{description}</p>
      {impact.length > 0 && (
        <KeyValue layout="grid" items={impact.map((item) => ({ label: item.label, value: item.value }))} />
      )}
      {(tags.length > 0 || links.length > 0) && (
        <div className="kl-project-card__footer">
          {tags.length > 0 && (
            <ul className="kl-project-card__tags" aria-label={`Technologies used in ${name}`}>
              {tags.map((tag) => (
                <li key={tag} className="kl-project-card__tag">
                  <Badge tone="neutral">{tag}</Badge>
                </li>
              ))}
            </ul>
          )}
          {links.length > 0 && (
            <ul className="kl-project-card__links" aria-label={`Links for ${name}`}>
              {links.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a className="kl-project-card__link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}

export type ProjectListProps = ComponentPropsWithRef<"section"> & {
  /** Section heading (default "Projects"). */
  heading?: string;
  /** Project entries to render. */
  items: ResumeProjectItem[];
  /** Number of columns on wide screens (default 2). */
  columns?: 1 | 2;
  /** Section heading level (default 2; project titles render one level deeper). */
  headingLevel?: 2 | 3;
};

/** Grid or stack of `ProjectCard` blocks with measurable impact numbers, tech tags and external links. */
export function ProjectList({
  heading = "Projects",
  items,
  columns = 2,
  headingLevel = 2,
  className,
  ...props
}: ProjectListProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  const cardLevel = (headingLevel + 1) as 3 | 4;
  return (
    <section {...props} className={cx("kl-project-list", `kl-project-list--cols-${columns}`, className)}>
      <Heading className="kl-project-list__heading">{heading}</Heading>
      <div className="kl-project-list__grid">
        {items.map((item) => (
          <ProjectCard key={item.name} {...item} headingLevel={cardLevel} />
        ))}
      </div>
    </section>
  );
}
