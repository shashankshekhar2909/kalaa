import type { ComponentPropsWithRef } from "react";
import type { ResumeCertificationItem } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { cx } from "../../util";

export type CertificationsProps = ComponentPropsWithRef<"section"> & {
  /** Section heading (default "Certifications"). */
  heading?: string;
  /** Certification entries. */
  items: ResumeCertificationItem[];
  /** Section heading level (default 2). */
  headingLevel?: 2 | 3;
};

/** Professional certifications list with issuing body, semantic `<time>` dates and credential badges. */
export function Certifications({
  heading = "Certifications",
  items,
  headingLevel = 2,
  className,
  ...props
}: CertificationsProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  return (
    <section {...props} className={cx("kl-certifications", className)}>
      <Heading className="kl-certifications__heading">{heading}</Heading>
      <ul className="kl-certifications__list">
        {items.map((item) => (
          <li key={`${item.name}-${item.date}`} className="kl-certifications__item">
            <div className="kl-certifications__main">
              {item.href ? (
                <a className="kl-certifications__name kl-certifications__link" href={item.href}>
                  {item.name}
                </a>
              ) : (
                <span className="kl-certifications__name">{item.name}</span>
              )}
              <span className="kl-certifications__issuer">{item.issuer}</span>
            </div>
            <div className="kl-certifications__meta">
              <span className="kl-certifications__dates">
                <time dateTime={item.date}>{item.date}</time>
                {item.expiryDate && (
                  <>
                    <span> – </span>
                    <time dateTime={item.expiryDate}>{item.expiryDate}</time>
                  </>
                )}
              </span>
              {item.credentialId && <Badge tone="neutral">{item.credentialId}</Badge>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
