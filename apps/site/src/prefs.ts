// Display preferences: accent, theme and shape. Stored in localStorage (guarded; invalid values are ignored) and applied
// as plain data attributes on <html> by an inline script before first paint (see head-script.ts).
export const PREFS = {
  accent: { attr: "data-accent", fallback: "neel", values: ["neel", "geru", "mayur"] },
  theme: { attr: "data-theme", fallback: "system", values: ["system", "light", "dark"] },
  shape: { attr: "data-shape", fallback: "square", values: ["square", "soft"] },
} as const;
export type PrefKey = keyof typeof PREFS;
export type Prefs = { [K in PrefKey]: (typeof PREFS)[K]["values"][number] };
export const defaultPrefs: Prefs = { accent: "neel", theme: "system", shape: "square" };
const storageKey = (key: PrefKey) => `kalaa-site-${key}`;

function isValid(key: PrefKey, value: unknown): value is Prefs[PrefKey] {
  return typeof value === "string" && (PREFS[key].values as readonly string[]).includes(value);
}
export function readPref(key: PrefKey): Prefs[PrefKey] {
  try {
    const stored = localStorage.getItem(storageKey(key));
    if (isValid(key, stored)) return stored;
  } catch {
    // Storage blocked: fall back to the default.
  }
  return PREFS[key].fallback;
}
/** Applies one preference to <html>. The default value removes the attribute (neel, system, square). */
export function applyPref(key: PrefKey, value: Prefs[PrefKey]) {
  const root = document.documentElement;
  if (value === PREFS[key].fallback) root.removeAttribute(PREFS[key].attr);
  else root.setAttribute(PREFS[key].attr, value);
}
export function savePref(key: PrefKey, value: Prefs[PrefKey]) {
  applyPref(key, value);
  try {
    localStorage.setItem(storageKey(key), value);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
}
/** Current values as set on <html> (what the head script applied). */
export function currentPrefs(): Prefs {
  const root = document.documentElement;
  const read = <K extends PrefKey>(key: K): Prefs[K] => {
    const value = root.getAttribute(PREFS[key].attr);
    return (isValid(key, value) ? value : PREFS[key].fallback) as Prefs[K];
  };
  return { accent: read("accent"), theme: read("theme"), shape: read("shape") };
}
