import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../util";
import { Sparkline, type SparklineTone } from "./Sparkline";

export type StatTrendDirection = "up" | "down" | "flat";
export type StatTrendSentiment = "positive" | "negative" | "neutral";

export type StatTrendProps = ComponentPropsWithRef<"div"> & {
  /** Metric title, e.g. "Catalog imports". */
  label: ReactNode;
  /** Primary tabular figure, e.g. "1,482". */
  value: ReactNode;
  /** Change amount, e.g. "+14.2%" or "+184 items". */
  delta?: ReactNode;
  /** Trend direction for the non-colour directional arrow (`↑`, `↓`, `→`). */
  trend?: StatTrendDirection;
  /** Colour meaning of the delta (defaults to positive for up, negative for down, neutral for flat). */
  sentiment?: StatTrendSentiment;
  /** Time comparison label, e.g. "vs last week". */
  period?: ReactNode;
  /** Optional series rendered as an inline Sparkline. */
  data?: ReadonlyArray<number>;
  /** Accessible label for the sparkline. */
  sparklineLabel?: string;
  /** Sparkline colour tone. */
  sparklineTone?: SparklineTone;
};

const TREND_GLYPH: Record<StatTrendDirection, string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

const TREND_WORD: Record<StatTrendDirection, string> = {
  up: "Increased",
  down: "Decreased",
  flat: "Unchanged",
};

export function StatTrend({
  label,
  value,
  delta,
  trend = "flat",
  sentiment,
  period,
  data,
  sparklineLabel,
  sparklineTone,
  className,
  ...props
}: StatTrendProps) {
  const resolvedSentiment: StatTrendSentiment =
    sentiment ?? (trend === "up" ? "positive" : trend === "down" ? "negative" : "neutral");
  const resolvedTone: SparklineTone =
    sparklineTone ??
    (resolvedSentiment === "positive" ? "chart-3" : resolvedSentiment === "negative" ? "chart-2" : "chart-1");
  const fallbackSparkLabel =
    sparklineLabel ?? (typeof label === "string" ? `${label} trend` : "Metric trend");

  return (
    <div {...props} className={cx("kl-stat-trend", className)}>
      <div className="kl-stat-trend__top">
        <span className="kl-stat-trend__label">{label}</span>
      </div>
      <div className="kl-stat-trend__main">
        <strong className="kl-stat-trend__value">{value}</strong>
        {data && data.length > 0 && (
          <Sparkline
            data={data}
            label={fallbackSparkLabel}
            tone={resolvedTone}
            width={104}
            height={28}
            area
          />
        )}
      </div>
      {(delta !== undefined || period !== undefined) && (
        <div className="kl-stat-trend__footer">
          {delta !== undefined && (
            <span
              className={cx("kl-stat-trend__delta", `kl-stat-trend__delta--${resolvedSentiment}`)}
              aria-label={`${TREND_WORD[trend]} ${typeof delta === "string" || typeof delta === "number" ? delta : ""}`.trim()}
            >
              <span aria-hidden="true">{TREND_GLYPH[trend]}</span>
              <span>{delta}</span>
            </span>
          )}
          {period !== undefined && <span className="kl-stat-trend__period">{period}</span>}
        </div>
      )}
    </div>
  );
}
