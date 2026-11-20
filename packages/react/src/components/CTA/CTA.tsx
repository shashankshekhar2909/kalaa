import type { ComponentPropsWithRef } from "react";
import type { LandingCtaData } from "../../schemas/types";
import { ButtonLink } from "../Button/Button";
import { Card } from "../Card/Card";
import { cx } from "../../util";

export type CTAProps = Omit<ComponentPropsWithRef<"section">, "title"> &
  LandingCtaData & {
    /** Heading level (default 2). */
    headingLevel?: 2 | 3;
  };

/** Call-to-action banner block built on Kalaa `Card` and `ButtonLink` with one primary action and an optional secondary link. */
export function CTA({
  title,
  description,
  primaryAction,
  secondaryAction,
  note,
  headingLevel = 2,
  className,
  ...props
}: CTAProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  return (
    <Card {...props} as="section" className={cx("kl-cta", className)}>
      <div className="kl-cta__body">
        <div className="kl-cta__copy">
          <Heading className="kl-cta__title">{title}</Heading>
          {description && <p className="kl-cta__description">{description}</p>}
          {note && <p className="kl-cta__note">{note}</p>}
        </div>
        <div className="kl-cta__actions">
          <ButtonLink variant="primary" href={primaryAction.href}>
            {primaryAction.label}
          </ButtonLink>
          {secondaryAction && (
            <ButtonLink variant="secondary" href={secondaryAction.href}>
              {secondaryAction.label}
            </ButtonLink>
          )}
        </div>
      </div>
    </Card>
  );
}
