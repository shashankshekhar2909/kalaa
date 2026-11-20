import type { ComponentPropsWithRef } from "react";
import type { ResumeContactLink } from "../../schemas/types";
import { Badge } from "../Badge/Badge";
import { cx } from "../../util";

export type ResumeHeaderProps = Omit<ComponentPropsWithRef<"header">, "title"> & {
  /** Candidate full name (rendered as `h1`). */
  name: string;
  /** Primary professional title or headline. */
  title: string;
  /** City, region or timezone. */
  location?: string;
  /** Contact email address. */
  email?: string;
  /** Contact phone number. */
  phone?: string;
  /** Personal website URL. */
  website?: string;
  /** Additional profile or portfolio links. */
  links?: ResumeContactLink[];
  /** Optional availability or status label shown in a badge. */
  badge?: string;
};

/** Top identity header for a web or print resume with name, role title, location and contact links. */
export function ResumeHeader({
  name,
  title,
  location,
  email,
  phone,
  website,
  links = [],
  badge,
  className,
  ...props
}: ResumeHeaderProps) {
  const contactItems: Array<{ key: string; label: string; href?: string }> = [];
  if (location) contactItems.push({ key: "location", label: location });
  if (email) contactItems.push({ key: "email", label: email, href: `mailto:${email}` });
  if (phone) contactItems.push({ key: "phone", label: phone, href: `tel:${phone.replace(/\s+/g, "")}` });
  if (website) {
    const cleanLabel = website.replace(/^https?:\/\//, "").replace(/\/$/, "");
    contactItems.push({ key: "website", label: cleanLabel, href: website });
  }
  for (const link of links) {
    contactItems.push({ key: `${link.label}-${link.href}`, label: link.label, href: link.href });
  }

  return (
    <header {...props} className={cx("kl-resume-header", className)}>
      <div className="kl-resume-header__top">
        <div className="kl-resume-header__identity">
          <h1 className="kl-resume-header__name">{name}</h1>
          <p className="kl-resume-header__title">{title}</p>
        </div>
        {badge && (
          <div className="kl-resume-header__badge">
            <Badge tone="info">{badge}</Badge>
          </div>
        )}
      </div>
      {contactItems.length > 0 && (
        <ul className="kl-resume-header__contacts" aria-label="Contact details">
          {contactItems.map((item) => (
            <li key={item.key} className="kl-resume-header__contact-item">
              {item.href ? (
                <a className="kl-resume-header__link" href={item.href}>
                  {item.label}
                </a>
              ) : (
                <span className="kl-resume-header__location">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
