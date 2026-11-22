import { useCallback, useEffect, useMemo, useRef, useState, type ComponentPropsWithRef } from "react";
import { cx } from "../../util";
import type { ButtonSize, ButtonVariant } from "../Button/Button";
import { Popover, type PopoverAlign, type PopoverSide } from "../Popover/Popover";
import { RadioGroup } from "../RadioGroup/RadioGroup";

export type Appearance = {
  theme: "auto" | "light" | "dark";
  accent: "neel" | "geru" | "mayur";
  shape: "square" | "soft";
};

const KEY = "kalaa.theme";
const DEFAULTS: Appearance = { theme: "auto", accent: "neel", shape: "square" };

export const APPEARANCE_OPTIONS = {
  theme: ["auto", "light", "dark"],
  accent: ["neel", "geru", "mayur"],
  shape: ["square", "soft"],
} as const;

export function readAppearance(): Appearance {
  try {
    if (typeof document === "undefined" || typeof localStorage === "undefined") {
      return { ...DEFAULTS };
    }
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}") as Partial<Appearance>;
    const legacy = localStorage.getItem("theme");
    const out: Appearance = { ...DEFAULTS };
    // Per-app defaults from <html data-default-theme|accent|shape>; a saved choice below still wins.
    for (const k of Object.keys(APPEARANCE_OPTIONS) as (keyof Appearance)[]) {
      const d = document.documentElement.getAttribute(`data-default-${k}`);
      if (d && (APPEARANCE_OPTIONS[k] as readonly string[]).includes(d))
        (out as Record<string, string>)[k] = d;
    }
    if (legacy === "light" || legacy === "dark") out.theme = legacy;
    if (saved && typeof saved === "object") {
      for (const k of Object.keys(APPEARANCE_OPTIONS) as (keyof Appearance)[]) {
        const v = saved[k];
        if (typeof v === "string" && (APPEARANCE_OPTIONS[k] as readonly string[]).includes(v)) {
          (out as Record<string, string>)[k] = v;
        }
      }
    }
    return out;
  } catch {
    return { ...DEFAULTS };
  }
}

export function applyAppearance(a: Appearance): void {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  const theme = (APPEARANCE_OPTIONS.theme as readonly string[]).includes(a.theme) ? a.theme : DEFAULTS.theme;
  const accent = (APPEARANCE_OPTIONS.accent as readonly string[]).includes(a.accent)
    ? a.accent
    : DEFAULTS.accent;
  const shape = (APPEARANCE_OPTIONS.shape as readonly string[]).includes(a.shape) ? a.shape : DEFAULTS.shape;
  if (theme === "auto") delete html.dataset.theme;
  else html.dataset.theme = theme;
  html.dataset.accent = accent;
  html.dataset.shape = shape;
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) meta.setAttribute("content", theme === "auto" ? "dark light" : theme);
}

const formatLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const subscribers = new Set<(next: Appearance) => void>();

function notifySubscribers(next: Appearance) {
  for (const fn of subscribers) {
    fn(next);
  }
}

export type UseAppearanceReturn = Appearance & {
  /** Current appearance state (`{ theme, accent, shape }`). */
  appearance: Appearance;
  /** Updates one or more appearance options, applies them to `<html>` and persists to `localStorage`. */
  setAppearance: (patch: Partial<Appearance>) => void;
  /** Alias for `setAppearance`. */
  update: (patch: Partial<Appearance>) => void;
  /** Sets the colour mode (`"auto" | "light" | "dark"`). */
  setTheme: (theme: Appearance["theme"]) => void;
  /** Sets the accent palette (`"neel" | "geru" | "mayur"`). */
  setAccent: (accent: Appearance["accent"]) => void;
  /** Sets the corner shape (`"square" | "soft"`). */
  setShape: (shape: Appearance["shape"]) => void;
  /** Available values for each appearance option. */
  options: typeof APPEARANCE_OPTIONS;
};

export interface KalaaThemeApi {
  readonly options: typeof APPEARANCE_OPTIONS;
  get: () => Appearance;
  set: (patch: Partial<Appearance>) => void;
  onChange: (fn: (appearance: Appearance) => void) => (() => void) | void;
}

declare global {
  interface Window {
    KalaaTheme?: KalaaThemeApi;
  }
}

/**
 * Reads and updates the active Kalaa appearance (`theme`, `accent`, `shape`), persisted in
 * `localStorage` under `"kalaa.theme"` and synced across tabs and `<kalaa-theme-picker>`.
 */
export function useAppearance(): UseAppearanceReturn {
  const [appearance, setAppearanceState] = useState<Appearance>(() => readAppearance());
  const appearanceRef = useRef(appearance);
  appearanceRef.current = appearance;

  useEffect(() => {
    const syncState = (next: Appearance) => {
      appearanceRef.current = next;
      setAppearanceState((prev) =>
        prev.theme === next.theme && prev.accent === next.accent && prev.shape === next.shape ? prev : next,
      );
    };

    syncState(readAppearance());
    subscribers.add(syncState);

    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY || e.key === null) {
        const next = readAppearance();
        applyAppearance(next);
        syncState(next);
      }
    };
    window.addEventListener("storage", onStorage);

    const kalaaTheme = (
      window as Window & {
        KalaaTheme?: {
          onChange?: (fn: (next: Appearance) => void) => (() => void) | void;
        };
      }
    ).KalaaTheme;
    const unsubKalaaTheme = kalaaTheme?.onChange?.((next) => {
      syncState(next);
    });

    return () => {
      subscribers.delete(syncState);
      window.removeEventListener("storage", onStorage);
      if (typeof unsubKalaaTheme === "function") unsubKalaaTheme();
    };
  }, []);

  const setAppearance = useCallback((patch: Partial<Appearance>) => {
    const merged = { ...appearanceRef.current, ...patch };
    const next: Appearance = {
      theme: (APPEARANCE_OPTIONS.theme as readonly string[]).includes(merged.theme)
        ? merged.theme
        : DEFAULTS.theme,
      accent: (APPEARANCE_OPTIONS.accent as readonly string[]).includes(merged.accent)
        ? merged.accent
        : DEFAULTS.accent,
      shape: (APPEARANCE_OPTIONS.shape as readonly string[]).includes(merged.shape)
        ? merged.shape
        : DEFAULTS.shape,
    };
    appearanceRef.current = next;
    setAppearanceState(next);
    applyAppearance(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      localStorage.removeItem("theme");
    } catch {
      /* Keep the in-memory choice. */
    }
    if (typeof window !== "undefined") {
      const kalaaTheme = (
        window as Window & {
          KalaaTheme?: {
            get?: () => Appearance;
            set?: (p: Partial<Appearance>) => void;
          };
        }
      ).KalaaTheme;
      if (kalaaTheme?.set) {
        const cur = kalaaTheme.get?.();
        if (!cur || cur.theme !== next.theme || cur.accent !== next.accent || cur.shape !== next.shape) {
          kalaaTheme.set(next);
        }
      }
    }
    notifySubscribers(next);
  }, []);

  const setTheme = useCallback((theme: Appearance["theme"]) => setAppearance({ theme }), [setAppearance]);
  const setAccent = useCallback((accent: Appearance["accent"]) => setAppearance({ accent }), [setAppearance]);
  const setShape = useCallback((shape: Appearance["shape"]) => setAppearance({ shape }), [setAppearance]);

  return useMemo(
    () => ({
      ...appearance,
      appearance,
      setAppearance,
      update: setAppearance,
      setTheme,
      setAccent,
      setShape,
      options: APPEARANCE_OPTIONS,
    }),
    [appearance, setAppearance, setTheme, setAccent, setShape],
  );
}

export type AppearanceMenuProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  /** Trigger button and popover heading label (default "Appearance"). */
  label?: string;
  /** Preferred popover side relative to the trigger (default "bottom"). */
  side?: PopoverSide;
  /** Alignment along the popover side (default "start"). */
  align?: PopoverAlign;
  /** Controlled popover open state. */
  open?: boolean;
  /** Initial popover open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Visual variant of the trigger button (default "ghost"). */
  triggerVariant?: ButtonVariant;
  /** Size of the trigger button (default "sm"). */
  triggerSize?: ButtonSize;
  /** Called when the user changes theme, accent or corner shape. */
  onAppearanceChange?: (appearance: Appearance) => void;
};

/**
 * Anchored appearance picker built from Kalaa `Popover` and `RadioGroup` for switching
 * theme (`auto`, `light`, `dark`), accent colour (`neel`, `geru`, `mayur`) and corners (`square`, `soft`).
 */
export function AppearanceMenu({
  label = "Appearance",
  side = "bottom",
  align = "start",
  open,
  defaultOpen,
  onOpenChange,
  triggerVariant = "ghost",
  triggerSize = "sm",
  onAppearanceChange,
  className,
  ...props
}: AppearanceMenuProps) {
  const { appearance, setAppearance } = useAppearance();

  function handleUpdate(patch: Partial<Appearance>) {
    const next = { ...appearance, ...patch };
    setAppearance(patch);
    onAppearanceChange?.(next);
  }

  return (
    <Popover
      {...props}
      side={side}
      align={align}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      title={label}
      className={cx("kl-appearance-menu__popover", className)}
      trigger={
        // Native <button> with Button's classes: Base UI attaches its anchor ref directly, so the popover is
        // positioned correctly on React 18 apps too (function components only receive refs on React 19).
        <button
          type="button"
          className={cx("kl-button", `kl-button--${triggerVariant}`, `kl-button--${triggerSize}`)}
        >
          <span className="kl-button__content">
            <span
              aria-hidden="true"
              className={cx("kl-appearance-menu__swatch", `kl-appearance-menu__swatch--${appearance.accent}`)}
            />
            {label}
          </span>
        </button>
      }
    >
      <div className="kl-appearance-menu">
        <span className="kl-appearance-menu__heading">Theme</span>
        <RadioGroup
          aria-label="Theme"
          orientation="horizontal"
          value={appearance.theme}
          onValueChange={(v) => handleUpdate({ theme: v as Appearance["theme"] })}
          options={APPEARANCE_OPTIONS.theme.map((v) => ({ value: v, label: formatLabel(v) }))}
        />
        <span className="kl-appearance-menu__heading">Accent colour</span>
        <RadioGroup
          aria-label="Accent colour"
          orientation="horizontal"
          value={appearance.accent}
          onValueChange={(v) => handleUpdate({ accent: v as Appearance["accent"] })}
          options={APPEARANCE_OPTIONS.accent.map((v) => ({
            value: v,
            label: (
              <span className="kl-appearance-menu__option">
                <span
                  aria-hidden="true"
                  className={cx("kl-appearance-menu__swatch", `kl-appearance-menu__swatch--${v}`)}
                />
                {formatLabel(v)}
              </span>
            ),
          }))}
        />
        <span className="kl-appearance-menu__heading">Corners</span>
        <RadioGroup
          aria-label="Corners"
          orientation="horizontal"
          value={appearance.shape}
          onValueChange={(v) => handleUpdate({ shape: v as Appearance["shape"] })}
          options={APPEARANCE_OPTIONS.shape.map((v) => ({ value: v, label: formatLabel(v) }))}
        />
      </div>
    </Popover>
  );
}
