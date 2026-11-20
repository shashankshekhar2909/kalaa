import type { ComponentPropsWithRef } from "react";
import type { PortfolioContact } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { ButtonLink } from "../Button/Button";
import { Card } from "../Card/Card";
import { KeyValue } from "../KeyValue/KeyValue";
import { cx } from "../../util";

export type ContactCardProps = Omit<ComponentPropsWithRef<"section">, "title"> &
  PortfolioContact & {
    /** Heading level for the card title (default 2). */
    headingLevel?: 2 | 3 | 4;
  };

/** Direct contact card with structured `KeyValue` details, availability badge, profile links and primary `mailto:` action. */
export function ContactCard({
  title = "Get in touch",
  description,
  email,
  phone,
  location,
  availability,
  responseTime,
  ctaLabel = "Send email",
  links = [],
  headingLevel = 2,
  className,
  ...props
}: ContactCardProps) {
  const details: Array<{ label: string; value: React.ReactNode }> = [
    {
      label: "Email",
      value: (
        <a className="kl-contact-card__link" href={`mailto:${email}`}>
          {email}
        </a>
      ),
    },
  ];
  if (phone) {
    details.push({
      label: "Phone",
      value: (
        <a className="kl-contact-card__link" href={`tel:${phone.replace(/\s+/g, "")}`}>
          {phone}
        </a>
      ),
    });
  }
  if (location) details.push({ label: "Location", value: location });
  if (responseTime) details.push({ label: "Response time", value: responseTime });

  return (
    <Card
      {...props}
      as="section"
      title={title}
      titleLevel={headingLevel}
      description={description}
      actions={availability ? <Badge tone="info">{availability}</Badge> : undefined}
      className={cx("kl-contact-card", className)}
    >
      <KeyValue items={details} />
      <div className="kl-contact-card__footer">
        <ButtonLink variant="primary" href={`mailto:${email}`}>
          {ctaLabel}
        </ButtonLink>
        {links.length > 0 && (
          <ul className="kl-contact-card__links" aria-label="Additional profiles">
            {links.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <a className="kl-contact-card__link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
