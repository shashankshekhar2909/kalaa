import type { ComponentPropsWithRef } from "react";
import type { PortfolioProfile } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { ButtonLink } from "../Button/Button";
import { Card } from "../Card/Card";
import { cx } from "../../util";

export type ProfileCardProps = Omit<ComponentPropsWithRef<"section">, "title"> &
  PortfolioProfile & {
    /** Heading level for the person's name (default 2). */
    headingLevel?: 2 | 3;
  };

/** Personal profile summary card with monogram avatar, biography, highlight metrics, skill badges and actions. */
export function ProfileCard({
  name,
  role,
  location,
  bio,
  availability,
  initials,
  skills = [],
  stats = [],
  primaryAction,
  secondaryAction,
  headingLevel = 2,
  className,
  ...props
}: ProfileCardProps) {
  const monogram =
    initials ??
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");

  return (
    <Card {...props} as="section" className={cx("kl-profile-card", className)}>
      <div className="kl-profile-card__header">
        <div className="kl-profile-card__identity">
          <span className="kl-profile-card__avatar" aria-hidden="true">
            {monogram}
          </span>
          <div>
            {headingLevel === 2 ? (
              <h2 className="kl-profile-card__name">{name}</h2>
            ) : (
              <h3 className="kl-profile-card__name">{name}</h3>
            )}
            <p className="kl-profile-card__role">
              <span>{role}</span>
              {location && <span> · {location}</span>}
            </p>
          </div>
        </div>
        {availability && <Badge tone="success">{availability}</Badge>}
      </div>
      <p className="kl-profile-card__bio">{bio}</p>
      {stats.length > 0 && (
        <dl className="kl-profile-card__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="kl-profile-card__stat">
              <dt className="kl-profile-card__stat-label">{stat.label}</dt>
              <dd className="kl-profile-card__stat-value">{stat.value}</dd>
              {stat.detail && <dd className="kl-profile-card__stat-detail">{stat.detail}</dd>}
            </div>
          ))}
        </dl>
      )}
      {skills.length > 0 && (
        <ul className="kl-profile-card__skills" aria-label="Core skills">
          {skills.map((skill) => (
            <li key={skill}>
              <Badge tone="neutral">{skill}</Badge>
            </li>
          ))}
        </ul>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="kl-profile-card__actions">
          {primaryAction && (
            <ButtonLink variant="primary" href={primaryAction.href}>
              {primaryAction.label}
            </ButtonLink>
          )}
          {secondaryAction && (
            <ButtonLink variant="secondary" href={secondaryAction.href}>
              {secondaryAction.label}
            </ButtonLink>
          )}
        </div>
      )}
    </Card>
  );
}
