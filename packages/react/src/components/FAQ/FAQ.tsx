import type { ComponentPropsWithRef } from "react";
import type { LandingFaqItem } from "../../schemas/types";
import { SectionHeader } from "../SectionHeader/SectionHeader";
import { cx } from "../../util";

export type FAQProps = ComponentPropsWithRef<"section"> & {
  /** Section heading (default "Frequently asked questions"). */
  heading?: string;
  /** Optional supporting description. */
  description?: string;
  /** Question and answer pairs rendered as native `<details>` disclosures. */
  items: LandingFaqItem[];
  /** Opens all items by default (also ensures full answer visibility when printing). */
  defaultOpenAll?: boolean;
  /** Section heading level (default 2). */
  headingLevel?: 2 | 3;
};

/** Frequently asked questions block built on native `<details>` and `<summary>` so it works without JavaScript. */
export function FAQ({
  heading = "Frequently asked questions",
  description,
  items,
  defaultOpenAll = false,
  headingLevel = 2,
  className,
  ...props
}: FAQProps) {
  return (
    <section {...props} className={cx("kl-faq", className)}>
      {heading && <SectionHeader title={heading} description={description} headingLevel={headingLevel} />}
      <div className="kl-faq__list">
        {items.map((item, index) => (
          <details
            key={item.question}
            className="kl-faq__item"
            open={defaultOpenAll || index === 0 || undefined}
          >
            <summary className="kl-faq__question">{item.question}</summary>
            <div className="kl-faq__answer">
              <p className="kl-faq__answer-text">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
