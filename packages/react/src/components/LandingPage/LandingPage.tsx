import type { ComponentPropsWithRef } from "react";
import type { LandingPageData } from "../../schemas/types";
import { ButtonLink } from "../Button/Button";
import { CTA } from "../CTA/CTA";
import { FAQ } from "../FAQ/FAQ";
import { FeatureGrid } from "../FeatureGrid/FeatureGrid";
import { Hero } from "../Hero/Hero";
import { LogoMark } from "../Logo/Logo";
import { PageFooter } from "../PageFooter/PageFooter";
import { SectionHeader } from "../SectionHeader/SectionHeader";
import { StatsBand } from "../StatsBand/StatsBand";
import { TestimonialCard } from "../TestimonialCard/TestimonialCard";
import { cx } from "../../util";

export type LandingPageProps = ComponentPropsWithRef<"div"> & {
  /** Complete JSON-serialisable marketing page data object conforming to `LandingPageData`. */
  data: LandingPageData;
};

/**
 * Full data-driven product landing page template composed from Kalaa marketing blocks.
 * Includes `<header>`, `<nav>`, `<main>` and `<footer>` landmarks and strict `h1` -> `h2` -> `h3` heading hierarchy.
 */
export function LandingPage({ data, className, ...props }: LandingPageProps) {
  const {
    brandName,
    navigation = [],
    headerAction,
    hero,
    stats,
    features,
    testimonials,
    faq,
    cta,
    footer,
  } = data;

  return (
    <div {...props} className={cx("kl-landing-page", className)}>
      <header className="kl-landing-page__header">
        <div className="kl-landing-page__brand">
          <span className="kl-landing-page__logo">
            <LogoMark decorative />
          </span>
          <span className="kl-landing-page__brand-name">{brandName}</span>
        </div>
        <div className="kl-landing-page__nav-group">
          {navigation.length > 0 && (
            <nav aria-label="Primary site navigation">
              <ul className="kl-landing-page__nav">
                {navigation.map((item) => (
                  <li key={`${item.label}-${item.href}`}>
                    <a className="kl-landing-page__nav-link" href={item.href}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          {headerAction && (
            <ButtonLink size="sm" variant="primary" href={headerAction.href}>
              {headerAction.label}
            </ButtonLink>
          )}
        </div>
      </header>

      <main className="kl-landing-page__main">
        <Hero {...hero} headingLevel={1} />

        {stats && stats.items.length > 0 && (
          <div id="stats">
            <StatsBand
              heading={stats.heading}
              description={stats.description}
              stats={stats.items}
              headingLevel={2}
            />
          </div>
        )}

        <div id="features">
          <FeatureGrid
            heading={features.heading}
            description={features.description}
            features={features.items}
            headingLevel={2}
          />
        </div>

        {testimonials && testimonials.items.length > 0 && (
          <section id="testimonials" className="kl-landing-page__section">
            <SectionHeader
              title={testimonials.heading}
              description={testimonials.description}
              headingLevel={2}
            />
            <div className="kl-landing-page__testimonials">
              {testimonials.items.map((item) => (
                <TestimonialCard key={`${item.author}-${item.org}`} {...item} />
              ))}
            </div>
          </section>
        )}

        {faq && faq.items.length > 0 && (
          <div id="faq">
            <FAQ heading={faq.heading} description={faq.description} items={faq.items} headingLevel={2} />
          </div>
        )}

        <div id="cta">
          <CTA {...cta} headingLevel={2} />
        </div>
      </main>

      <PageFooter {...footer} />
    </div>
  );
}
