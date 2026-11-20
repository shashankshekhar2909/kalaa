import { useId, useRef, useState, type ComponentPropsWithRef, type DragEvent, type ReactNode } from "react";
import { cx } from "../../util";
export type DropZoneProps = Omit<ComponentPropsWithRef<"div">, "onSelect"> & {
  /** Primary prompt inside the drop target. */
  label?: ReactNode;
  /** Secondary instructions below the prompt. */
  description?: ReactNode;
  /** Accepted MIME types or extensions (for example ".csv,text/csv"). */
  accept?: string;
  /** Maximum file size in bytes; displays a size-limit message and rejects larger files. */
  maxSizeBytes?: number;
  /** Allows selecting more than one file at once. */
  multiple?: boolean;
  /** Disables clicking and dropping. */
  disabled?: boolean;
  /** Called with accepted files after a drop or file-picker selection. */
  onFiles?: (files: File[]) => void;
  /** Called when a file is rejected (size limit exceeded or type mismatch). */
  onReject?: (reason: string, file: File) => void;
};
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    const mb = bytes / (1024 * 1024);
    return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    const kb = Math.round(bytes / 1024);
    return `${kb} KB`;
  }
  return `${bytes} B`;
}
function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const rules = accept
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (rules.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}
export function DropZone({
  label = "Drop a file here, or click to browse",
  description,
  accept,
  maxSizeBytes,
  multiple = false,
  disabled = false,
  onFiles,
  onReject,
  className,
  ...props
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const id = useId();
  const metaParts: string[] = [];
  if (accept) metaParts.push(`Accepted: ${accept}`);
  if (maxSizeBytes) metaParts.push(`Maximum size: ${formatBytes(maxSizeBytes)}`);
  const metaText = metaParts.join(" · ");
  function handleFileList(list: FileList | null) {
    if (!list || list.length === 0 || disabled) return;
    const incoming = multiple ? Array.from(list) : [list[0]];
    const valid: File[] = [];
    let firstError: string | null = null;
    for (const file of incoming) {
      if (!matchesAccept(file, accept)) {
        const msg = `${file.name} does not match accepted formats (${accept}).`;
        firstError ??= msg;
        onReject?.(msg, file);
        continue;
      }
      if (maxSizeBytes !== undefined && file.size > maxSizeBytes) {
        const msg = `${file.name} exceeds the ${formatBytes(maxSizeBytes)} size limit.`;
        firstError ??= msg;
        onReject?.(msg, file);
        continue;
      }
      valid.push(file);
    }
    setError(firstError);
    if (valid.length > 0) {
      setSelectedNames(valid.map((f) => f.name));
      onFiles?.(valid);
    }
  }
  function onDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!disabled) setDragging(true);
  }
  function onDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
  }
  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    handleFileList(event.dataTransfer?.files ?? null);
  }
  const describedBy =
    [description && `${id}-desc`, metaText && `${id}-meta`, error && `${id}-error`]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div
      {...props}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
      data-invalid={Boolean(error) || undefined}
      className={cx("kl-drop-zone", className)}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        className="kl-drop-zone__input"
        onChange={(event) => {
          handleFileList(event.target.files);
          event.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={disabled}
        aria-describedby={describedBy}
        className="kl-drop-zone__target"
        onClick={() => inputRef.current?.click()}
      >
        <span className="kl-drop-zone__label">{label}</span>
        {description && (
          <span id={`${id}-desc`} className="kl-drop-zone__description">
            {description}
          </span>
        )}
        {metaText && (
          <span id={`${id}-meta`} className="kl-drop-zone__meta">
            {metaText}
          </span>
        )}
        {selectedNames.length > 0 && (
          <span className="kl-drop-zone__selected">Selected: {selectedNames.join(", ")}</span>
        )}
      </button>
      {error && (
        <div id={`${id}-error`} role="alert" className="kl-drop-zone__error">
          {error}
        </div>
      )}
    </div>
  );
}
