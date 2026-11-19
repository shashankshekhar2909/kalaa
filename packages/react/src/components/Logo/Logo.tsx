import type { ComponentPropsWithRef } from "react";
import { cx } from "../../util";
export type LogoProps = Omit<ComponentPropsWithRef<"span">, "title"> & {
  /** "mark" is the square only; "lockup" adds the Kalaa wordmark. */
  variant?: "mark" | "lockup";
  /** Height of the mark in px (the wordmark scales with it). Minimum 16 for the mark, 96px wide for the lockup. */
  size?: number;
  /** Accessible name of the mark. The lockup shows its own "Kalaa" text and ignores it. */
  title?: string;
  /** Single-colour version: frame and corner both use currentColor. */
  mono?: boolean;
};
/** The Kalaa square: a frame (the unlit moon) with a lit L-shaped crescent. Fills only, no strokes. */
export function LogoMark({
  title = "Kalaa",
  mono,
  decorative,
}: {
  title?: string;
  mono?: boolean;
  decorative?: boolean;
}) {
  return (
    <svg
      className="kl-logo__mark"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      focusable="false"
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title })}
    >
      <path
        className={mono ? "kl-logo__frame kl-logo__frame--mono" : "kl-logo__frame"}
        fillRule="evenodd"
        d="M2 2H30V30H2Z M4 4V28H28V4Z"
      />
      <path className={mono ? "kl-logo__lit kl-logo__lit--mono" : "kl-logo__lit"} d="M6 6H14V18H26V26H6Z" />
    </svg>
  );
}
export function Logo({ variant = "mark", size, title, mono, className, style, ...props }: LogoProps) {
  const height = size ?? (variant === "lockup" ? 28 : 32);
  const sized = { ...style, fontSize: height };
  if (variant === "mark")
    return (
      <span {...props} className={cx("kl-logo", "kl-logo--mark", className)} style={sized}>
        <LogoMark title={title} mono={mono} />
      </span>
    );
  return (
    <span {...props} className={cx("kl-logo", "kl-logo--lockup", className)} style={sized}>
      <LogoMark decorative mono={mono} />
      <span className="kl-logo__text">Kalaa</span>
    </span>
  );
}
