import StyleDictionary from "style-dictionary";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
const read = (file) => JSON.parse(readFileSync(new URL(file, import.meta.url)));
const palette = read("./src/palette.json").palette,
  foundation = read("./src/foundation.json"),
  mappings = read("./src/roles.json"),
  shapeSource = read("./src/shapes.json"),
  contrastSource = read("./src/contrast-pairs.json"),
  contrastPairs = contrastSource.pairs,
  chartContrastPairs = contrastSource.chartPairs ?? [];
const chartPalette = {
  categorical: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6", "chart-7", "chart-8"],
  sequential: ["chart-seq-1", "chart-seq-2", "chart-seq-3", "chart-seq-4", "chart-seq-5"],
  diverging: ["chart-div-1", "chart-div-2", "chart-div-3", "chart-div-4", "chart-div-5"],
  roles: [
    "chart-gridline",
    "chart-axis-text",
    "chart-tooltip-surface",
    "chart-tooltip-text",
    "chart-tooltip-border",
  ],
};
const accents = ["neel", "geru", "mayur"],
  modes = ["light", "dark"],
  themes = {};
for (const accent of accents) {
  themes[accent] = {};
  for (const mode of modes) {
    const roleTokens = {};
    for (const [role, ref] of Object.entries(mappings[mode])) {
      const path = ref.$value
        .replace("ACCENT", accent)
        .replace("NEUTRAL", `${accent}-neutral`)
        .replace("DANGER", accent === "geru" ? "crimson" : "red");
      roleTokens[role] = { $type: "color", $value: path };
    }
    // Style Dictionary resolves DTCG aliases for each theme.
    const sd = new StyleDictionary({
      tokens: { palette, role: roleTokens },
      platforms: { raw: { transforms: [] } },
    });
    const dictionary = await sd.getPlatformTokens("raw");
    themes[accent][mode] = Object.fromEntries(
      dictionary.allTokens.filter((t) => t.path[0] === "role").map((t) => [t.path[1], t.$value]),
    );
  }
}
// Shapes: the first entry is the default (:root); the others are opt-in via data-shape.
const shapes = Object.keys(shapeSource);
const flat = (obj, prefix = []) =>
  Object.entries(obj).flatMap(([k, v]) =>
    v.$value !== undefined ? [[[...prefix, k].join("-"), v.$value]] : flat(v, [...prefix, k]),
  );
const shapeVars = (shape) => flat(shapeSource[shape]);
const primitives = flat({ palette, ...foundation });
const vars = (entries) => entries.map(([k, v]) => `  --kalaa-${k}: ${v};`).join("\n");
const roleVars = (a, m) => vars(Object.entries(themes[a][m]));
// Selectors use attributes alone (specificity 0,1,0, same as :root), so they also work on nested wrappers
// such as <div data-accent="geru" data-theme="dark" data-shape="soft">. Later rules win on ties.
// Nested wrappers that change theme should also set data-accent when it is not Neel.
const accentSel = (a) => (a === "neel" ? `:root,\n[data-accent="neel"]` : `[data-accent="${a}"]`);
let css = `/* Generated from DTCG tokens. */\n:root {\n${vars(primitives)}\n}\n`;
css += `${shapes[0] === "square" ? ":root,\n" : ""}[data-shape="${shapes[0]}"] {\n${vars(shapeVars(shapes[0]))}\n}\n`;
for (const s of shapes.slice(1)) css += `[data-shape="${s}"] {\n${vars(shapeVars(s))}\n}\n`;
for (const a of accents) css += `${accentSel(a)} {\n${roleVars(a, "light")}\n  color-scheme: light;\n}\n`;
css += "@media (prefers-color-scheme: dark) {\n";
for (const a of accents) {
  const selector =
    a === "neel"
      ? ':root:not([data-theme="light"]),\n  [data-accent="neel"]:not([data-theme="light"])'
      : `[data-accent="${a}"]:not([data-theme="light"])`;
  css += `  ${selector} {\n${roleVars(a, "dark")}\n    color-scheme: dark;\n  }\n`;
}
css += "}\n";
// Forced modes (after the media query, so they win over the system preference).
for (const m of modes)
  for (const a of accents) {
    const sel =
      a === "neel"
        ? `:root[data-theme="${m}"],\n[data-accent="neel"][data-theme="${m}"],\n[data-theme="${m}"]:not([data-accent])`
        : `[data-accent="${a}"][data-theme="${m}"]`;
    css += `${sel} {\n${roleVars(a, m)}\n  color-scheme: ${m};\n}\n`;
  }
// A nested accent wrapper without its own data-theme follows an ancestor's forced theme (otherwise it would take the
// light or system value of its accent while the page is forced the other way).
for (const m of modes)
  for (const a of accents)
    css += `[data-theme="${m}"] [data-accent="${a}"]:not([data-theme]) {\n${roleVars(a, m)}\n  color-scheme: ${m};\n}\n`;
css +=
  "@media (prefers-reduced-motion: reduce) {\n  :root { --kalaa-duration-fast: 0ms; --kalaa-duration-base: 0ms; }\n}\n";
mkdirSync(new URL("./dist", import.meta.url), { recursive: true });
const write = (name, s) => writeFileSync(new URL(`./dist/${name}`, import.meta.url), s);
write("tokens.css", css);
write("tokens.json", JSON.stringify(themes, null, 2) + "\n");
// Self-hosted IBM Plex (SIL OFL 1.1) from the @fontsource packages: WOFF2 only, latin + latin-ext (+ devanagari for the
// Devanagari family), with each file's unicode-range so browsers fetch only what a page uses.
const families = [
  ["ibm-plex-sans", [400, 500, 600], ["latin", "latin-ext"]],
  ["ibm-plex-sans-devanagari", [400, 500, 600], ["devanagari"]],
  ["ibm-plex-serif", [400, 500], ["latin", "latin-ext"]],
  ["ibm-plex-mono", [400, 500], ["latin", "latin-ext"]],
];
const fontsDir = new URL("./dist/fonts/", import.meta.url);
mkdirSync(fontsDir, { recursive: true });
let fonts =
  "/* Generated by build.mjs from @fontsource/ibm-plex-* (SIL Open Font License 1.1; licences in ./fonts/). Self-hosted, no network. */\n";
for (const [pkg, weights, subsets] of families) {
  const dir = new URL(`./node_modules/@fontsource/${pkg}/`, import.meta.url);
  copyFileSync(new URL("LICENSE", dir), new URL(`LICENSE-${pkg}.txt`, fontsDir));
  for (const weight of weights) {
    const source = readFileSync(new URL(`${weight}.css`, dir), "utf8");
    for (const block of source.split("/* ").slice(1)) {
      const subset = subsets.find((s) => block.startsWith(`${pkg}-${s}-${weight}-normal`));
      if (!subset) continue;
      const file = `${pkg}-${subset}-${weight}-normal.woff2`;
      copyFileSync(new URL(`files/${file}`, dir), new URL(file, fontsDir));
      fonts += `@font-face {\n  font-family: '${block.match(/font-family: '([^']+)'/)[1]}';\n  font-style: normal;\n  font-display: swap;\n  font-weight: ${weight};\n  src: url(./fonts/${file}) format('woff2');\n  unicode-range: ${block.match(/unicode-range: ([^;]+);/)[1]};\n}\n`;
    }
  }
}
write("fonts.css", fonts);

const appearanceOptions = {
  theme: ["auto", ...modes],
  accent: accents,
  shape: shapes,
};
const accentSwatches = Object.fromEntries(accents.map((a) => [a, palette[a]["700"].$value]));
const appearanceScript = `try{var a=JSON.parse(localStorage.getItem("kalaa.theme")||"{}"),h=document.documentElement,l=localStorage.getItem("theme"),D=function(k){return h.getAttribute("data-default-"+k)},t=a.theme||l||D("theme");a.accent=a.accent||D("accent");a.shape=a.shape||D("shape");if(t==="auto")delete h.dataset.theme;else if(${JSON.stringify(modes)}.indexOf(t)>=0)h.dataset.theme=t;if(${JSON.stringify(accents)}.indexOf(a.accent)>=0)h.dataset.accent=a.accent;if(${JSON.stringify(shapes)}.indexOf(a.shape)>=0)h.dataset.shape=a.shape}catch(e){}`;

write(
  "appearance-script.js",
  `export const appearanceScript = ${JSON.stringify(appearanceScript)};\nexport default appearanceScript;\n`,
);
write(
  "appearance-script.d.ts",
  `export declare const appearanceScript: string;\nexport default appearanceScript;\n`,
);

write(
  "theme.js",
  `/* Kalaa theme helper (framework-free). Applies and remembers the Kalaa options on <html>:
   data-theme (light | dark | omitted = follow the OS), data-accent (neel | geru | mayur), data-shape (square | soft).
   API: KalaaTheme.get(), KalaaTheme.set({theme, accent, shape}), KalaaTheme.options, KalaaTheme.onChange(fn).
   Stored in localStorage "kalaa.theme"; changes sync across tabs.
   Load it in <head> (not deferred) so the first paint already has the right colours. */
(function (root) {
  "use strict";
  if (!root || !root.document) return;
  var KEY = "kalaa.theme";
  var OPTIONS = ${JSON.stringify(appearanceOptions)};
  var SWATCHES = ${JSON.stringify(accentSwatches)};
  var html = root.document.documentElement;
  /* Per-app defaults: <html data-default-theme="dark" data-default-accent="mayur" data-default-shape="soft">.
     A choice the viewer saved still wins. */
  function dflt(k, list, fb) { var v = html.getAttribute("data-default-" + k); return list.indexOf(v) >= 0 ? v : fb; }
  var defaults = {
    theme: dflt("theme", OPTIONS.theme, "auto"),
    accent: dflt("accent", OPTIONS.accent, OPTIONS.accent[0]),
    shape: dflt("shape", OPTIONS.shape, OPTIONS.shape[0])
  };
  var listeners = [];
  function readRaw() {
    try { return root.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function read() {
    var out = {};
    try {
      var v = JSON.parse(readRaw() || "{}");
      if (v && typeof v === "object") out = v;
    } catch (e) {}
    try {
      var legacy = root.localStorage.getItem("theme");
      if (out.theme === undefined && (legacy === "light" || legacy === "dark")) out.theme = legacy;
    } catch (e) {}
    return out;
  }
  function clean(v) {
    var out = {};
    var src = v && typeof v === "object" ? v : {};
    Object.keys(OPTIONS).forEach(function (k) {
      out[k] = OPTIONS[k].indexOf(src[k]) >= 0 ? src[k] : defaults[k];
    });
    return out;
  }
  function apply(v) {
    if (v.theme === "auto") html.removeAttribute("data-theme");
    else html.setAttribute("data-theme", v.theme);
    html.setAttribute("data-accent", v.accent);
    html.setAttribute("data-shape", v.shape);
    var meta = root.document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute("content", v.theme === "auto" ? "dark light" : v.theme);
  }
  var lastRaw = readRaw();
  var memoryOnly = false;
  var current = clean(read());
  apply(current);
  var api = {
    options: OPTIONS,
    swatches: SWATCHES,
    get: function () {
      var raw = readRaw();
      if (!memoryOnly && raw !== lastRaw) {
        lastRaw = raw;
        current = clean(read());
      }
      return { theme: current.theme, accent: current.accent, shape: current.shape };
    },
    set: function (patch) {
      current = clean(Object.assign({}, api.get(), patch || {}));
      var serialized = JSON.stringify(current);
      try {
        root.localStorage.setItem(KEY, serialized);
        root.localStorage.removeItem("theme");
        lastRaw = serialized;
        memoryOnly = false;
      } catch (e) {
        memoryOnly = true;
      }
      apply(current);
      listeners.slice().forEach(function (fn) {
        try { fn(api.get()); } catch (e) {}
      });
    },
    onChange: function (fn) {
      listeners.push(fn);
      return function () {
        var idx = listeners.indexOf(fn);
        if (idx >= 0) listeners.splice(idx, 1);
      };
    }
  };
  function onStorage(e) {
    if (!e || e.key === KEY || e.key === null) {
      lastRaw = readRaw();
      memoryOnly = false;
      current = clean(read());
      apply(current);
      listeners.slice().forEach(function (fn) {
        try { fn(api.get()); } catch (x) {}
      });
    }
  }
  if (root.KalaaTheme && root.KalaaTheme._onStorage) {
    root.removeEventListener("storage", root.KalaaTheme._onStorage);
  }
  Object.defineProperty(api, "_onStorage", { value: onStorage, enumerable: false });
  root.addEventListener("storage", onStorage);
  root.KalaaTheme = api;
})(typeof window !== "undefined" ? window : globalThis);
`,
);

write(
  "theme.d.ts",
  `import type { KalaaThemeApi } from "./index.js";
declare global {
  interface Window {
    KalaaTheme?: KalaaThemeApi;
  }
}
export {};
`,
);

const pickerLabels = {
  theme: Object.fromEntries(["auto", ...modes].map((m) => [m, m.charAt(0).toUpperCase() + m.slice(1)])),
  accent: Object.fromEntries(accents.map((a) => [a, a.charAt(0).toUpperCase() + a.slice(1)])),
  shape: Object.fromEntries(shapes.map((s) => [s, s.charAt(0).toUpperCase() + s.slice(1)])),
};

write(
  "theme-picker.js",
  `/* <kalaa-theme-picker> — appearance menu for any plain-HTML app using Kalaa (needs theme.js loaded first).
   Usage: <kalaa-theme-picker></kalaa-theme-picker>   (optional attribute: label="Appearance")
   A button opens a small menu: Theme (Auto/Light/Dark), Accent (Neel/Geru/Mayur swatches), Corners (Square/Soft).
   Styled only with Kalaa tokens; keyboard: Enter/Space to open, Esc to close, arrows move within a group. */
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.KalaaTheme || typeof customElements === "undefined" || customElements.get("kalaa-theme-picker")) return;
  var LABELS = ${JSON.stringify(pickerLabels)};
  var SWATCH = ${JSON.stringify(accentSwatches)};
  var CSS = "\\
:host{position:relative;display:inline-block;font-family:var(--kalaa-font-sans)}\\
button{font:inherit;color:inherit;cursor:pointer}\\
.trigger{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:var(--kalaa-radius-md,8px);\\
 border:1px solid var(--kalaa-border);background:var(--kalaa-surface);color:var(--kalaa-text)}\\
.trigger:hover{background:var(--kalaa-surface-alt)}\\
.trigger:focus-visible,.opt:focus-visible{outline:2px solid var(--kalaa-focus);outline-offset:2px}\\
svg{width:18px;height:18px}\\
.menu{position:absolute;right:0;top:calc(100% + 8px);z-index:80;min-width:248px;padding:14px;border-radius:var(--kalaa-radius-lg,12px);\\
 border:1px solid var(--kalaa-border);background:var(--kalaa-surface);color:var(--kalaa-text);box-shadow:var(--kalaa-shadow-2)}\\
.menu[hidden]{display:none}\\
h3{margin:0 0 6px;font-size:var(--kalaa-font-size-xs,12px);font-weight:var(--kalaa-font-weight-medium,500);color:var(--kalaa-text-muted)}\\
.group{display:flex;gap:6px;margin-bottom:14px}.group:last-child{margin-bottom:0}\\
.opt{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:34px;padding:0 10px;\\
 border-radius:var(--kalaa-radius-sm,6px);border:1px solid var(--kalaa-border);background:transparent;color:var(--kalaa-text-muted);\\
 font-size:var(--kalaa-font-size-sm,13px)}\\
.opt[aria-checked=true]{border-color:var(--kalaa-accent);color:var(--kalaa-text);background:var(--kalaa-accent-soft)}\\
.dot{width:12px;height:12px;border-radius:var(--kalaa-radius-full,999px);flex:none}\\
";
  var ICON = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
    '<path d="M10 2.5a7.5 7.5 0 1 0 0 15c1 0 1.6-.8 1.3-1.7-.3-.9.3-1.8 1.3-1.8H14a3.5 3.5 0 0 0 3.5-3.5c0-4.4-3.4-8-7.5-8Z"/>' +
    '<circle cx="6.5" cy="9" r="1"/><circle cx="9.5" cy="6" r="1"/><circle cx="13.2" cy="7.5" r="1"/></svg>';

  class Picker extends HTMLElement {
    connectedCallback() {
      var self = this;
      var T = window.KalaaTheme;
      if (!T) return;
      if (!this.shadowRoot) {
        var root = this.attachShadow({ mode: "open" });
        var label = this.getAttribute("label") || "Appearance";
        root.innerHTML = "<style>" + CSS + "</style>" +
          '<button class="trigger" type="button" aria-haspopup="true" aria-expanded="false" aria-label="' + label + '" title="' + label + '">' + ICON + "</button>" +
          '<div class="menu" role="dialog" aria-label="' + label + '" hidden></div>';
        this._btn = root.querySelector(".trigger");
        this._menu = root.querySelector(".menu");
        this._build();
        this._btn.addEventListener("click", function () { self._toggle(); });
      }
      this._sync();
      this._onDocClick = function (e) {
        if (!self.contains(e.target) && (!e.composedPath || !e.composedPath().includes(self))) self._toggle(false);
      };
      this._onDocKey = function (e) {
        if (e.key === "Escape" && !self._menu.hidden) { self._toggle(false); self._btn.focus(); }
      };
      document.addEventListener("click", this._onDocClick);
      document.addEventListener("keydown", this._onDocKey);
      this._unsub = T.onChange(function () { self._sync(); });
    }
    disconnectedCallback() {
      if (this._onDocClick) document.removeEventListener("click", this._onDocClick);
      if (this._onDocKey) document.removeEventListener("keydown", this._onDocKey);
      if (typeof this._unsub === "function") this._unsub();
    }
    _build() {
      var menu = this._menu, T = window.KalaaTheme;
      Object.keys(LABELS).forEach(function (key) {
        var h = document.createElement("h3"); h.textContent = key === "theme" ? "Theme" : key === "accent" ? "Accent colour" : "Corners";
        var g = document.createElement("div"); g.className = "group"; g.setAttribute("role", "radiogroup"); g.setAttribute("aria-label", h.textContent);
        T.options[key].forEach(function (val) {
          var b = document.createElement("button"); b.type = "button"; b.className = "opt"; b.setAttribute("role", "radio");
          b.dataset.key = key; b.dataset.val = val;
          if (key === "accent") { var d = document.createElement("span"); d.className = "dot"; d.style.background = SWATCH[val]; b.appendChild(d); }
          b.appendChild(document.createTextNode(LABELS[key][val]));
          b.addEventListener("click", function () { var p = {}; p[key] = val; window.KalaaTheme.set(p); });
          b.addEventListener("keydown", function (e) {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            var sibs = Array.prototype.slice.call(g.children), i = sibs.indexOf(b);
            var n = sibs[(i + (e.key === "ArrowRight" ? 1 : sibs.length - 1)) % sibs.length]; n.focus(); n.click(); e.preventDefault();
          });
          g.appendChild(b);
        });
        menu.appendChild(h); menu.appendChild(g);
      });
      this._sync();
    }
    _sync() {
      if (!this._menu || !window.KalaaTheme) return;
      var cur = window.KalaaTheme.get();
      Array.prototype.forEach.call(this._menu.querySelectorAll(".opt"), function (b) {
        var on = cur[b.dataset.key] === b.dataset.val;
        b.setAttribute("aria-checked", on ? "true" : "false"); b.tabIndex = on ? 0 : -1;
      });
    }
    _toggle(force) {
      var open = typeof force === "boolean" ? force : this._menu.hidden;
      this._menu.hidden = !open; this._btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) { var c = this._menu.querySelector('.opt[aria-checked="true"]'); if (c) c.focus(); }
    }
  }
  customElements.define("kalaa-theme-picker", Picker);
})();
`,
);

write("theme-picker.d.ts", `export {};\n`);

write(
  "index.js",
  `export const accents = ${JSON.stringify(accents)};
export const contrastPairs = ${JSON.stringify(contrastPairs)};
export const chartContrastPairs = ${JSON.stringify(chartContrastPairs)};
export const chartPalette = ${JSON.stringify(chartPalette, null, 2)};
export const modes = ${JSON.stringify(modes)};
export const shapes = ${JSON.stringify(shapes)};
export const tokens = ${JSON.stringify(themes, null, 2)};
export const appearanceOptions = ${JSON.stringify(appearanceOptions)};
export const accentSwatches = ${JSON.stringify(accentSwatches)};
export const appearanceScript = ${JSON.stringify(appearanceScript)};

const APPEARANCE_KEY = "kalaa.theme";
const APPEARANCE_DEFAULTS = { theme: "auto", accent: accents[0], shape: shapes[0] };

export function readAppearance() {
  try {
    if (typeof document === "undefined" || typeof localStorage === "undefined") {
      return { ...APPEARANCE_DEFAULTS };
    }
    const saved = JSON.parse(localStorage.getItem(APPEARANCE_KEY) || "{}");
    const legacy = localStorage.getItem("theme");
    const out = { ...APPEARANCE_DEFAULTS };
    for (const k of Object.keys(appearanceOptions)) {
      const d = document.documentElement.getAttribute("data-default-" + k);
      if (d && appearanceOptions[k].includes(d)) out[k] = d;
    }
    if (legacy && modes.includes(legacy)) out.theme = legacy;
    if (saved && typeof saved === "object") {
      for (const k of Object.keys(appearanceOptions)) {
        const v = saved[k];
        if (typeof v === "string" && appearanceOptions[k].includes(v)) out[k] = v;
      }
    }
    return out;
  } catch {
    return { ...APPEARANCE_DEFAULTS };
  }
}

export function applyAppearance(a) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  const next = {
    theme: appearanceOptions.theme.includes(a?.theme) ? a.theme : APPEARANCE_DEFAULTS.theme,
    accent: appearanceOptions.accent.includes(a?.accent) ? a.accent : APPEARANCE_DEFAULTS.accent,
    shape: appearanceOptions.shape.includes(a?.shape) ? a.shape : APPEARANCE_DEFAULTS.shape,
  };
  if (next.theme === "auto") html.removeAttribute("data-theme");
  else html.setAttribute("data-theme", next.theme);
  html.setAttribute("data-accent", next.accent);
  html.setAttribute("data-shape", next.shape);
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) meta.setAttribute("content", next.theme === "auto" ? "dark light" : next.theme);
}

function createKalaaTheme() {
  const listeners = [];
  const readRaw = () => {
    try {
      return typeof document !== "undefined" && typeof localStorage !== "undefined"
        ? localStorage.getItem(APPEARANCE_KEY)
        : null;
    } catch {
      return null;
    }
  };
  let lastRaw = readRaw();
  let memoryOnly = false;
  let current = readAppearance();
  const api = {
    options: appearanceOptions,
    swatches: accentSwatches,
    get() {
      if (typeof window !== "undefined" && window.KalaaTheme && window.KalaaTheme !== api) {
        return window.KalaaTheme.get();
      }
      const raw = readRaw();
      if (!memoryOnly && raw !== lastRaw) {
        lastRaw = raw;
        current = readAppearance();
      }
      return { theme: current.theme, accent: current.accent, shape: current.shape };
    },
    set(patch) {
      if (typeof window !== "undefined" && window.KalaaTheme && window.KalaaTheme !== api) {
        window.KalaaTheme.set(patch);
        return;
      }
      const base = this.get();
      const merged = { ...base, ...(patch || {}) };
      current = {
        theme: appearanceOptions.theme.includes(merged.theme) ? merged.theme : APPEARANCE_DEFAULTS.theme,
        accent: appearanceOptions.accent.includes(merged.accent) ? merged.accent : APPEARANCE_DEFAULTS.accent,
        shape: appearanceOptions.shape.includes(merged.shape) ? merged.shape : APPEARANCE_DEFAULTS.shape,
      };
      const serialized = JSON.stringify(current);
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(APPEARANCE_KEY, serialized);
          localStorage.removeItem("theme");
          lastRaw = serialized;
          memoryOnly = false;
        }
      } catch {
        memoryOnly = true;
      }
      applyAppearance(current);
      for (const fn of listeners.slice()) {
        try {
          fn(api.get());
        } catch {}
      }
    },
    onChange(fn) {
      if (typeof window !== "undefined" && window.KalaaTheme && window.KalaaTheme !== api) {
        return window.KalaaTheme.onChange(fn);
      }
      listeners.push(fn);
      return () => {
        const idx = listeners.indexOf(fn);
        if (idx >= 0) listeners.splice(idx, 1);
      };
    },
  };
  if (typeof window !== "undefined") {
    const onStorage = (e) => {
      if (window.KalaaTheme && window.KalaaTheme !== api) return;
      if (!e || e.key === APPEARANCE_KEY || e.key === null) {
        lastRaw = readRaw();
        memoryOnly = false;
        current = readAppearance();
        applyAppearance(current);
        for (const fn of listeners.slice()) {
          try {
            fn(api.get());
          } catch {}
        }
      }
    };
    Object.defineProperty(api, "_onStorage", { value: onStorage, enumerable: false });
    window.addEventListener("storage", onStorage);
    if (!window.KalaaTheme) {
      window.KalaaTheme = api;
    }
  }
  return api;
}

export const KalaaTheme = createKalaaTheme();
`,
);
write(
  "index.d.ts",
  `export declare const accents: readonly ["neel", "geru", "mayur"];
export declare const modes: readonly ["light", "dark"];
export declare const shapes: readonly ${JSON.stringify(shapes)};
export type ContrastPair = readonly [Role, Role, number];
export declare const contrastPairs: readonly ContrastPair[];
export declare const chartContrastPairs: readonly ContrastPair[];
export declare const chartPalette: {
  readonly categorical: readonly Role[];
  readonly sequential: readonly Role[];
  readonly diverging: readonly Role[];
  readonly roles: readonly Role[];
};
export type Shape = typeof shapes[number];
export type Accent = typeof accents[number];
export type Mode = typeof modes[number];
export type ThemeOption = "auto" | Mode;
export type Appearance = {
  theme: ThemeOption;
  accent: Accent;
  shape: Shape;
};
export declare const appearanceOptions: {
  readonly theme: readonly ["auto", ...Mode[]];
  readonly accent: typeof accents;
  readonly shape: typeof shapes;
};
export declare const accentSwatches: Record<Accent, string>;
export declare const appearanceScript: string;
export declare function readAppearance(): Appearance;
export declare function applyAppearance(appearance: Appearance): void;
export interface KalaaThemeApi {
  readonly options: typeof appearanceOptions;
  readonly swatches: Record<Accent, string>;
  get: () => Appearance;
  set: (patch: Partial<Appearance>) => void;
  onChange: (fn: (appearance: Appearance) => void) => () => void;
}
export declare const KalaaTheme: KalaaThemeApi;
export type Role = ${Object.keys(themes.neel.light)
    .map((x) => JSON.stringify(x))
    .join(" | ")};
export declare const tokens: Record<Accent, Record<Mode, Record<Role, string>>>;
`,
);
