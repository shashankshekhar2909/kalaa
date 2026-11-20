import type { ComponentPropsWithRef } from "react";
import type { LanguageProficiencyLevel, ResumeLanguageItem } from "../../schemas/types";
import { Badge, type BadgeTone } from "../Badge/Badge";
import { cx } from "../../util";

const levelTone: Record<LanguageProficiencyLevel, BadgeTone> = {
  native: "success",
  fluent: "info",
  professional: "neutral",
  elementary: "neutral",
};

export type LanguagesProps = ComponentPropsWithRef<"section"> & {
  /** Section heading (default "Languages"). */
  heading?: string;
  /** Spoken or written languages with proficiency labels. */
  items: ResumeLanguageItem[];
  /** Section heading level (default 2). */
  headingLevel?: 2 | 3;
};

/** Spoken and written language proficiency block using Kalaa `Badge` tones. */
export function Languages({
  heading = "Languages",
  items,
  headingLevel = 2,
  className,
  ...props
}: LanguagesProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  return (
    <section {...props} className={cx("kl-languages", className)}>
      <Heading className="kl-languages__heading">{heading}</Heading>
      <ul className="kl-languages__list">
        {items.map((item) => (
          <li key={item.language} className="kl-languages__item">
            <span className="kl-languages__name">{item.language}</span>
            <Badge tone={item.level ? levelTone[item.level] : "neutral"}>{item.proficiency}</Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
