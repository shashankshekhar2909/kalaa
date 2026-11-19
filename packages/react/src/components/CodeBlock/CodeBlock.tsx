import { useEffect, useRef, useState, type ComponentPropsWithRef } from "react";
import { cx } from "../../util";
import { Button } from "../Button/Button";
export type CodeBlockProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** The code to show and copy. */
  code: string;
  /** Accessible name of the code region, for example "Install command". */
  label?: string;
  /** Hint for readers and tools, for example "bash" or "tsx". Not highlighted. */
  language?: string;
};
type CopyState = "idle" | "copied" | "failed";
const messages: Record<CopyState, string> = {
  idle: "",
  copied: "Copied",
  failed: "Select the text and copy it",
};
/** Monospace code with a Copy button. Falls back to a message when the clipboard is unavailable. */
export function CodeBlock({ code, label = "Code", language, className, ...props }: CodeBlockProps) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
    } catch {
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 4000);
  }
  return (
    <div {...props} role="group" aria-label={label} className={cx("kl-code-block", className)}>
      <pre className="kl-code-block__pre" tabIndex={0}>
        <code data-language={language}>{code}</code>
      </pre>
      <div className="kl-code-block__bar">
        <span className="kl-code-block__status" role="status" aria-live="polite">
          {messages[state]}
        </span>
        <Button variant="ghost" size="sm" onClick={copy} aria-label={`Copy ${label.toLowerCase()}`}>
          Copy
        </Button>
      </div>
    </div>
  );
}
