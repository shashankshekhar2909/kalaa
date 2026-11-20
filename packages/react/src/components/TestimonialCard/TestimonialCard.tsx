import type { ComponentPropsWithRef } from "react";
import type { PortfolioTestimonial } from "../../schemas/types";
import { Card } from "../Card/Card";
import { cx } from "../../util";

export type TestimonialCardProps = Omit<ComponentPropsWithRef<"article">, "title"> & PortfolioTestimonial;

/** Endorsement card with a semantic `<blockquote>`, author attribution, role, organisation and `<time>` date. */
export function TestimonialCard({
  quote,
  author,
  role,
  org,
  date,
  context,
  className,
  ...props
}: TestimonialCardProps) {
  return (
    <Card {...props} as="article" className={cx("kl-testimonial-card", className)}>
      <blockquote className="kl-testimonial-card__quote">
        <p className="kl-testimonial-card__text">“{quote}”</p>
      </blockquote>
      <div className="kl-testimonial-card__footer">
        <div className="kl-testimonial-card__author-block">
          <cite className="kl-testimonial-card__author">{author}</cite>
          <span className="kl-testimonial-card__role">
            {role}
            {org && ` · ${org}`}
          </span>
        </div>
        {(context || date) && (
          <div className="kl-testimonial-card__meta">
            {context && <span>{context}</span>}
            {context && date && <span> · </span>}
            {date && <time dateTime={date}>{date}</time>}
          </div>
        )}
      </div>
    </Card>
  );
}
