import type { ComponentPropsWithRef } from "react";
import type { ResumeData } from "../../schemas/types";
import { Awards } from "../Awards/Awards";
import { Certifications } from "../Certifications/Certifications";
import { EducationList } from "../EducationList/EducationList";
import { ExperienceList } from "../ExperienceList/ExperienceList";
import { Languages } from "../Languages/Languages";
import { ProjectList } from "../ProjectList/ProjectList";
import { ResumeHeader } from "../ResumeHeader/ResumeHeader";
import { SkillGroups } from "../SkillGroups/SkillGroups";
import { Summary } from "../Summary/Summary";
import { cx } from "../../util";

export type ResumePageLayout = "single-column" | "sidebar";
export type ResumePaperSize = "a4" | "letter";

export type ResumePageProps = ComponentPropsWithRef<"div"> & {
  /** Complete JSON-serialisable resume data object conforming to `ResumeData`. */
  data: ResumeData;
  /** Page layout: "single-column" (linear ATS flow, default) or "sidebar" (two-column print/web layout). */
  layout?: ResumePageLayout;
  /** Target print paper geometry: "a4" (210mm, default) or "letter" (8.5in). */
  paperSize?: ResumePaperSize;
  /** Forces black-on-white print tokens on screen (useful for previewing print output in dark mode). */
  forcePrintPreview?: boolean;
};

/**
 * Full data-driven resume template accepting one `ResumeData` object.
 * Supports single-column and sidebar layouts, A4/Letter paper geometry, ATS-friendly reading order and black-on-white print even in dark mode.
 */
export function ResumePage({
  data,
  layout = "single-column",
  paperSize = "a4",
  forcePrintPreview = false,
  className,
  ...props
}: ResumePageProps) {
  const {
    basics,
    summary,
    experience,
    education,
    skills,
    projects = [],
    certifications = [],
    languages = [],
    awards = [],
  } = data;

  const secondarySections = (
    <>
      <EducationList items={education} headingLevel={2} />
      <SkillGroups groups={skills} layout={layout === "sidebar" ? "stacked" : "grid"} headingLevel={2} />
      {certifications.length > 0 && <Certifications items={certifications} headingLevel={2} />}
      {languages.length > 0 && <Languages items={languages} headingLevel={2} />}
    </>
  );

  return (
    <div
      {...props}
      className={cx(
        "kl-resume-page",
        `kl-resume-page--${layout}`,
        `kl-resume-page--${paperSize}`,
        forcePrintPreview && "kl-resume-page--print",
        className,
      )}
    >
      <ResumeHeader {...basics} />
      <div className="kl-resume-page__body">
        <main className="kl-resume-page__main" aria-label="Resume experience and projects">
          <Summary
            heading={summary.heading ?? "Summary"}
            text={summary.text}
            highlights={summary.highlights}
            headingLevel={2}
          />
          <ExperienceList items={experience} headingLevel={2} />
          {projects.length > 0 && (
            <ProjectList items={projects} columns={layout === "sidebar" ? 1 : 2} headingLevel={2} />
          )}
          {layout === "single-column" && secondarySections}
          {awards.length > 0 && <Awards items={awards} headingLevel={2} />}
        </main>
        {layout === "sidebar" && (
          <aside className="kl-resume-page__sidebar" aria-label="Education, skills and credentials">
            {secondarySections}
          </aside>
        )}
      </div>
    </div>
  );
}
