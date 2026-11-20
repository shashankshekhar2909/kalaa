import type { ComponentPropsWithRef, ReactNode } from "react";
import { Meter } from "../Meter/Meter";
import { cx } from "../../util";

export type SuggestionReviewProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  proposal: ReactNode;
  source?: ReactNode;
  score?: { label: string; value?: number | null };
  alternatives?: readonly { id: string; label: ReactNode }[];
  alternativesLabel?: string;
  actions?: ReactNode;
};

export function SuggestionReview({
  proposal,
  source,
  score,
  alternatives = [],
  alternativesLabel = "Ranked alternatives",
  actions,
  className,
  ...props
}: SuggestionReviewProps) {
  return (
    <div {...props} className={cx("kl-suggestion-review", className)}>
      <div className="kl-suggestion-review__proposal">{proposal}</div>
      {source != null && <div className="kl-suggestion-review__source">{source}</div>}
      {score && <Meter label={score.label} value={score.value} />}
      {alternatives.length > 0 && (
        <div>
          <div>{alternativesLabel}</div>
          <ol aria-label={alternativesLabel} className="kl-suggestion-review__alternatives">
            {alternatives.map(({ id, label }) => (
              <li key={id}>{label}</li>
            ))}
          </ol>
        </div>
      )}
      {actions}
    </div>
  );
}
