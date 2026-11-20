import { useState, type ComponentPropsWithRef } from "react";
import { cx } from "../../util";
export type AvatarSize = "sm" | "md" | "lg";
export type AvatarShape = "circle" | "square";
export type AvatarProps = Omit<ComponentPropsWithRef<"span">, "children"> & {
  /** Person or team name; used to derive up to two initials and as the accessible label. */
  name?: string;
  /** Explicit initials override (for example "SR"). */
  initials?: string;
  /** Optional image URL; falls back to initials if omitted or if loading fails. */
  src?: string;
  /** Accessible image description; defaults to `name`. */
  alt?: string;
  /** Diameter: sm 24px, md 32px (default), lg 40px. */
  size?: AvatarSize;
  /** True circle (`--kalaa-radius-full`, default) or theme-shaped square (`--kalaa-radius-md`). */
  shape?: AvatarShape;
};
function deriveInitials(name?: string, initials?: string): string {
  if (initials) return initials.slice(0, 2).toUpperCase();
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
export function Avatar({
  name,
  initials,
  src,
  alt,
  size = "md",
  shape = "circle",
  className,
  ...props
}: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;
  const label = alt ?? name;
  const fallback = deriveInitials(name, initials);
  return (
    <span
      {...props}
      role={!showImage && label ? "img" : undefined}
      aria-label={!showImage ? label : undefined}
      className={cx("kl-avatar", `kl-avatar--${size}`, `kl-avatar--${shape}`, className)}
    >
      {showImage ? (
        <img
          className="kl-avatar__image"
          src={src}
          alt={label ?? ""}
          onError={() => {
            if (src) setFailedSrc(src);
          }}
        />
      ) : (
        <span className="kl-avatar__initials" aria-hidden={Boolean(label) || undefined}>
          {fallback}
        </span>
      )}
    </span>
  );
}
