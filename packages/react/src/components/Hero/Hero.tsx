import type { ComponentPropsWithRef } from "react";
import type { LandingHeroData } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { ButtonLink } from "../Button/Button";
import { cx } from "../../util";

export type HeroProps = Omit<ComponentPropsWithRef<"section">, "title"> &
  LandingHeroData & {
    /** Content alignment: "start" (default) or "center". */
    align?: "start" | "center";
    /** Heading level for the hero title (default 1). */
    headingLevel?: 1 | 2;
  };

/** Marketing hero block with optional badge, serif brand headline (`h1`), description, actions and factual highlights. */
export function Hero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  highlights = [],
  align = "start",
  headingLevel = 1,
  className,
  ...props
}: HeroProps) {
  const Heading = `h${headingLevel}` as "h1" | "h2";
  return (
    <section {...props} className={cx("kl-hero", `kl-hero--${align}`, className)}>
      {eyebrow && (
        <div className="kl-hero__eyebrow">
          <Badge tone="info">{eyebrow}</Badge>
        </div>
      )}
      <Heading className="kl-hero__title">{title}</Heading>
      <p className="kl-hero__description">{description}</p>
      {(primaryAction || secondaryAction) && (
        <div className="kl-hero__actions">
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
      {highlights.length > 0 && (
        <ul className="kl-hero__highlights" aria-label="Key highlights">
          {highlights.map((item) => (
            <li key={item} className="kl-hero__highlight">
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
