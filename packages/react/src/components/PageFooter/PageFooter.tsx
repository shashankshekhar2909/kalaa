import type { ComponentPropsWithRef } from "react";
import type { PortfolioFooter } from "../../schemas/types";
import { LogoMark } from "../Logo/Logo";
import { cx } from "../../util";

export type PageFooterProps = ComponentPropsWithRef<"footer"> & PortfolioFooter;

/** Semantic `<footer>` landmark with optional Kalaa mark, brand tagline, labelled `<nav>` link columns and copyright. */
export function PageFooter({
  brandName,
  tagline,
  columns = [],
  links = [],
  copyright,
  showLogo = true,
  className,
  ...props
}: PageFooterProps) {
  return (
    <footer {...props} className={cx("kl-page-footer", className)}>
      <div className="kl-page-footer__top">
        <div className="kl-page-footer__brand">
          <div className="kl-page-footer__lockup">
            {showLogo && (
              <span className="kl-page-footer__logo">
                <LogoMark decorative />
              </span>
            )}
            <span className="kl-page-footer__name">{brandName}</span>
          </div>
          {tagline && <p className="kl-page-footer__tagline">{tagline}</p>}
        </div>
        {columns.length > 0 && (
          <div className="kl-page-footer__columns">
            {columns.map((column) => (
              <nav
                key={column.heading}
                aria-label={`${column.heading} footer links`}
                className="kl-page-footer__column"
              >
                <div className="kl-page-footer__column-heading">{column.heading}</div>
                <ul className="kl-page-footer__list">
                  {column.links.map((link) => (
                    <li key={`${link.label}-${link.href}`}>
                      <a className="kl-page-footer__link" href={link.href}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        )}
      </div>
      {(copyright || links.length > 0) && (
        <div className="kl-page-footer__bottom">
          {copyright && <p className="kl-page-footer__copyright">{copyright}</p>}
          {links.length > 0 && (
            <nav aria-label="Footer utility links">
              <ul className="kl-page-footer__utility">
                {links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a className="kl-page-footer__link" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      )}
    </footer>
  );
}
