/** Joins class names, skipping falsy values. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const KALAA_VERSION = "0.2.1";
