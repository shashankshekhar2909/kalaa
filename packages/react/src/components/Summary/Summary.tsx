import type { ComponentPropsWithRef } from "react";
import { cx } from "../../util";

export type SummaryProps = ComponentPropsWithRef<"section"> & {
  /** Section heading text (default "Summary"). */
  heading?: string;
  /** Primary summary paragraph. */
  text: string;
  /** Optional factual highlights shown as a bulleted list. */
  highlights?: string[];
  /** Heading level (default 2). */
  headingLevel?: 2 | 3;
};

/** Executive summary block for a resume with a lead paragraph and optional factual highlights. */
export function Summary({
  heading = "Summary",
  text,
  highlights = [],
  headingLevel = 2,
  className,
  ...props
}: SummaryProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  return (
    <section {...props} className={cx("kl-summary", className)}>
      <Heading className="kl-summary__heading">{heading}</Heading>
      <p className="kl-summary__text">{text}</p>
      {highlights.length > 0 && (
        <ul className="kl-summary__highlights">
          {highlights.map((item, index) => (
            <li key={index} className="kl-summary__highlight">
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
