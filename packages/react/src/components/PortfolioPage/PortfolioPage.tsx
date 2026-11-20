import type { ComponentPropsWithRef } from "react";
import type { PortfolioData } from "../../schemas/types";
import { CaseStudyCard } from "../CaseStudyCard/CaseStudyCard";
import { ContactCard } from "../ContactCard/ContactCard";
import { LinkList } from "../LinkList/LinkList";
import { LogoMark } from "../Logo/Logo";
import { PageFooter } from "../PageFooter/PageFooter";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import { ProjectList } from "../ProjectList/ProjectList";
import { SectionHeader } from "../SectionHeader/SectionHeader";
import { SkillGroups } from "../SkillGroups/SkillGroups";
import { TestimonialCard } from "../TestimonialCard/TestimonialCard";
import { Timeline } from "../Timeline/Timeline";
import { cx } from "../../util";

export type PortfolioPageProps = ComponentPropsWithRef<"div"> & {
  /** Complete JSON-serialisable portfolio data object conforming to `PortfolioData`. */
  data: PortfolioData;
};

/**
 * Full data-driven personal portfolio page template composed from Kalaa blocks.
 * Includes semantic `<header>`, `<nav>`, `<main>` and `<footer>` landmarks and strict `h1` -> `h2` -> `h3` heading order.
 */
export function PortfolioPage({ data, className, ...props }: PortfolioPageProps) {
  const {
    navigation = [],
    profile,
    caseStudies,
    projects = [],
    timeline = [],
    skills = [],
    testimonials = [],
    links = [],
    contact,
    footer,
  } = data;

  return (
    <div {...props} className={cx("kl-portfolio-page", className)}>
      <header className="kl-portfolio-page__header">
        <div className="kl-portfolio-page__brand">
          <span className="kl-portfolio-page__logo">
            <LogoMark decorative />
          </span>
          <div>
            <h1 className="kl-portfolio-page__title">{profile.name}</h1>
            <p className="kl-portfolio-page__subtitle">{profile.role}</p>
          </div>
        </div>
        {navigation.length > 0 && (
          <nav aria-label="Primary portfolio navigation">
            <ul className="kl-portfolio-page__nav">
              {navigation.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <a className="kl-portfolio-page__nav-link" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main className="kl-portfolio-page__main">
        <ProfileCard {...profile} headingLevel={2} />

        <section id="case-studies" className="kl-portfolio-page__section">
          <SectionHeader
            title="Case studies"
            description="Selected architecture and design-system engagements with measured outcomes."
            headingLevel={2}
          />
          <div className="kl-portfolio-page__grid">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.title} {...study} headingLevel={3} />
            ))}
          </div>
        </section>

        {projects.length > 0 && (
          <div id="projects">
            <ProjectList heading="Open-source & product projects" items={projects} headingLevel={2} />
          </div>
        )}

        {timeline.length > 0 && (
          <div id="timeline">
            <Timeline heading="Career timeline" items={timeline} headingLevel={2} />
          </div>
        )}

        {skills.length > 0 && <SkillGroups heading="Technical skills" groups={skills} headingLevel={2} />}

        {testimonials.length > 0 && (
          <section className="kl-portfolio-page__section">
            <SectionHeader
              title="Endorsements"
              description="Feedback from engineering leaders and partner teams."
              headingLevel={2}
            />
            <div className="kl-portfolio-page__grid">
              {testimonials.map((item) => (
                <TestimonialCard key={`${item.author}-${item.org}`} {...item} />
              ))}
            </div>
          </section>
        )}

        {links.length > 0 && <LinkList heading="Writing & publications" items={links} headingLevel={2} />}

        <div id="contact">
          <ContactCard {...contact} headingLevel={2} />
        </div>
      </main>

      <PageFooter {...footer} />
    </div>
  );
}
