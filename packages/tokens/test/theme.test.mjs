import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import vm from "node:vm";
import {
  KalaaTheme,
  accentSwatches,
  accents,
  appearanceOptions,
  appearanceScript,
  modes,
  shapes,
  tokens,
} from "../dist/index.js";
import defaultScript, { appearanceScript as namedScript } from "../dist/appearance-script.js";

const themeCode = readFileSync(new URL("../dist/theme.js", import.meta.url), "utf8");
const pickerCode = readFileSync(new URL("../dist/theme-picker.js", import.meta.url), "utf8");

function runInMockWindow(code, win) {
  const fn = new Function(
    "window",
    "globalThis",
    "document",
    "localStorage",
    "customElements",
    "HTMLElement",
    code,
  );
  fn(win, win, win.document, win.localStorage, win.customElements, win.HTMLElement);
}

function createMockWindow(initialStorage = {}) {
  const store = new Map(Object.entries(initialStorage));
  const attrs = new Map();
  const metaAttrs = new Map([["content", "dark light"]]);
  const windowListeners = new Map();

  const html = {
    getAttribute(k) {
      return attrs.has(k) ? attrs.get(k) : null;
    },
    setAttribute(k, v) {
      attrs.set(k, String(v));
    },
    removeAttribute(k) {
      attrs.delete(k);
    },
    hasAttribute(k) {
      return attrs.has(k);
    },
    dataset: new Proxy(
      {},
      {
        get(_, prop) {
          const attr = `data-${String(prop)}`;
          return attrs.get(attr);
        },
        set(_, prop, val) {
          attrs.set(`data-${String(prop)}`, String(val));
          return true;
        },
        deleteProperty(_, prop) {
          attrs.delete(`data-${String(prop)}`);
          return true;
        },
      },
    ),
  };

  const meta = {
    getAttribute(k) {
      return metaAttrs.get(k) ?? null;
    },
    setAttribute(k, v) {
      metaAttrs.set(k, String(v));
    },
  };

  const localStorage = {
    getItem(k) {
      return store.has(k) ? store.get(k) : null;
    },
    setItem(k, v) {
      store.set(k, String(v));
    },
    removeItem(k) {
      store.delete(k);
    },
    clear() {
      store.clear();
    },
  };

  const win = {
    document: {
      documentElement: html,
      querySelector(sel) {
        return sel === 'meta[name="color-scheme"]' ? meta : null;
      },
      addEventListener() {},
      removeEventListener() {},
    },
    localStorage,
    customElements: {
      _reg: new Map(),
      get(name) {
        return this._reg.get(name);
      },
      define(name, ctor) {
        if (this._reg.has(name)) throw new Error(`Already defined: ${name}`);
        this._reg.set(name, ctor);
      },
    },
    HTMLElement: class HTMLElement {},
    addEventListener(type, fn) {
      if (!windowListeners.has(type)) windowListeners.set(type, new Set());
      windowListeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      windowListeners.get(type)?.delete(fn);
    },
    dispatchStorage(key) {
      for (const fn of windowListeners.get("storage") ?? []) {
        fn({ key });
      }
    },
  };
  win.window = win;
  win.globalThis = win;
  return { win, html, meta, localStorage };
}

describe("@kalaa/tokens appearance exports & theme.js", () => {
  it("derives options and swatches from real token values", () => {
    assert.deepEqual(appearanceOptions, {
      theme: ["auto", ...modes],
      accent: accents,
      shape: shapes,
    });
    for (const accent of accents) {
      assert.equal(accentSwatches[accent], tokens[accent].light.accent);
    }
    assert.equal(typeof KalaaTheme.get, "function");
    assert.equal(typeof KalaaTheme.set, "function");
    assert.equal(typeof KalaaTheme.onChange, "function");
    assert.equal(appearanceScript, namedScript);
    assert.equal(defaultScript, namedScript);
  });

  it("invalid stored values fall back to defaults", () => {
    const { win, html } = createMockWindow({
      "kalaa.theme": JSON.stringify({ theme: "invalid", accent: "unknown", shape: "circle" }),
    });
    runInMockWindow(themeCode, win);

    assert.deepEqual(win.KalaaTheme.get(), {
      theme: "auto",
      accent: "neel",
      shape: "square",
    });
    assert.equal(html.hasAttribute("data-theme"), false);
    assert.equal(html.getAttribute("data-accent"), "neel");
    assert.equal(html.getAttribute("data-shape"), "square");
  });

  it("<html data-default-*> sets app defaults; a saved choice still wins", () => {
    const fresh = createMockWindow({});
    fresh.html.setAttribute("data-default-theme", "dark");
    fresh.html.setAttribute("data-default-accent", "mayur");
    fresh.html.setAttribute("data-default-shape", "bogus");
    runInMockWindow(themeCode, fresh.win);
    assert.deepEqual(fresh.win.KalaaTheme.get(), { theme: "dark", accent: "mayur", shape: "square" });
    assert.equal(fresh.html.getAttribute("data-theme"), "dark");

    const saved = createMockWindow({
      "kalaa.theme": JSON.stringify({ theme: "light", accent: "geru", shape: "soft" }),
    });
    saved.html.setAttribute("data-default-theme", "dark");
    runInMockWindow(themeCode, saved.win);
    assert.equal(saved.win.KalaaTheme.get().theme, "light");
    assert.equal(saved.html.getAttribute("data-theme"), "light");
  });

  it("auto removes data-theme from <html>", () => {
    const { win, html, meta } = createMockWindow({
      "kalaa.theme": JSON.stringify({ theme: "dark", accent: "neel", shape: "square" }),
    });
    runInMockWindow(themeCode, win);
    assert.equal(html.getAttribute("data-theme"), "dark");
    assert.equal(meta.getAttribute("content"), "dark");

    win.KalaaTheme.set({ theme: "auto" });
    assert.equal(html.hasAttribute("data-theme"), false);
    assert.equal(meta.getAttribute("content"), "dark light");
  });

  it("set() persists to localStorage and notifies onChange listeners", () => {
    const { win, html, localStorage } = createMockWindow();
    runInMockWindow(themeCode, win);

    const events = [];
    win.KalaaTheme.onChange((v) => events.push(v));

    win.KalaaTheme.set({ theme: "light", accent: "geru", shape: "soft" });

    assert.deepEqual(JSON.parse(localStorage.getItem("kalaa.theme")), {
      theme: "light",
      accent: "geru",
      shape: "soft",
    });
    assert.equal(html.getAttribute("data-theme"), "light");
    assert.equal(html.getAttribute("data-accent"), "geru");
    assert.equal(html.getAttribute("data-shape"), "soft");
    assert.deepEqual(events, [{ theme: "light", accent: "geru", shape: "soft" }]);
  });

  it("storage event syncs across tabs", () => {
    const { win, html, localStorage } = createMockWindow();
    runInMockWindow(themeCode, win);

    const events = [];
    win.KalaaTheme.onChange((v) => events.push(v));

    localStorage.setItem("kalaa.theme", JSON.stringify({ theme: "dark", accent: "mayur", shape: "soft" }));
    win.dispatchStorage("kalaa.theme");

    assert.deepEqual(win.KalaaTheme.get(), {
      theme: "dark",
      accent: "mayur",
      shape: "soft",
    });
    assert.equal(html.getAttribute("data-theme"), "dark");
    assert.equal(html.getAttribute("data-accent"), "mayur");
    assert.equal(html.getAttribute("data-shape"), "soft");
    assert.deepEqual(events, [{ theme: "dark", accent: "mayur", shape: "soft" }]);
  });

  it("theme-picker.js is safe to load twice and appearance-script applies before first paint", () => {
    const { win, html } = createMockWindow({
      "kalaa.theme": JSON.stringify({ theme: "dark", accent: "geru", shape: "soft" }),
    });
    runInMockWindow(appearanceScript, win);
    assert.equal(html.getAttribute("data-theme"), "dark");
    assert.equal(html.getAttribute("data-accent"), "geru");
    assert.equal(html.getAttribute("data-shape"), "soft");

    runInMockWindow(themeCode, win);
    runInMockWindow(pickerCode, win);
    runInMockWindow(pickerCode, win);
    assert.ok(win.customElements.get("kalaa-theme-picker"));
  });
});
