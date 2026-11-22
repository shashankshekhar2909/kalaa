import { createRef } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "../../../../tokens/dist/theme.js";
import "../../../../tokens/dist/theme-picker.js";
import { AppearanceMenu, applyAppearance, readAppearance, useAppearance } from "./AppearanceMenu";

function HookProbe() {
  const { appearance, setAppearance } = useAppearance();
  return (
    <div>
      <output data-testid="probe">
        {appearance.theme}:{appearance.accent}:{appearance.shape}
      </output>
      <button type="button" onClick={() => setAppearance({ theme: "dark", accent: "mayur", shape: "soft" })}>
        Apply Mayur Dark Soft
      </button>
    </div>
  );
}

describe("AppearanceMenu and useAppearance", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-accent");
    document.documentElement.removeAttribute("data-shape");
    document.head.innerHTML = "";
  });

  it("opens popover with Theme, Accent colour and Corners groups, updates attributes and persists", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const onAppearanceChange = vi.fn();

    render(
      <AppearanceMenu ref={ref} className="custom-appearance" onAppearanceChange={onAppearanceChange} />,
    );

    const trigger = screen.getByRole("button", { name: "Appearance" });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Appearance" });
    expect(dialog).toHaveClass("kl-popover", "kl-appearance-menu__popover", "custom-appearance");
    expect(ref.current).toBe(dialog);

    expect(screen.getByRole("radiogroup", { name: "Theme" })).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Accent colour" })).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Corners" })).toBeInTheDocument();

    expect(screen.getByRole("radio", { name: "Auto" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Neel" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Square" })).toBeChecked();

    await user.click(screen.getByRole("radio", { name: "Dark" }));
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(JSON.parse(localStorage.getItem("kalaa.theme") || "{}")).toEqual({
      theme: "dark",
      accent: "neel",
      shape: "square",
    });
    expect(onAppearanceChange).toHaveBeenLastCalledWith({
      theme: "dark",
      accent: "neel",
      shape: "square",
    });

    await user.click(screen.getByRole("radio", { name: "Geru" }));
    expect(document.documentElement).toHaveAttribute("data-accent", "geru");

    await user.click(screen.getByRole("radio", { name: "Soft" }));
    expect(document.documentElement).toHaveAttribute("data-shape", "soft");
    expect(JSON.parse(localStorage.getItem("kalaa.theme") || "{}")).toEqual({
      theme: "dark",
      accent: "geru",
      shape: "soft",
    });

    await user.click(screen.getByRole("radio", { name: "Auto" }));
    expect(document.documentElement).not.toHaveAttribute("data-theme");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("falls back on invalid stored values and migrates legacy theme storage key", () => {
    localStorage.setItem(
      "kalaa.theme",
      JSON.stringify({ theme: "midnight", accent: "violet", shape: "pill" }),
    );
    expect(readAppearance()).toEqual({ theme: "auto", accent: "neel", shape: "square" });

    localStorage.setItem("kalaa.theme", "{not-valid-json");
    expect(readAppearance()).toEqual({ theme: "auto", accent: "neel", shape: "square" });

    localStorage.removeItem("kalaa.theme");
    localStorage.setItem("theme", "dark");
    expect(readAppearance()).toEqual({ theme: "dark", accent: "neel", shape: "square" });
  });

  it("uses <html data-default-*> when nothing is saved, and a saved choice wins", () => {
    document.documentElement.setAttribute("data-default-theme", "dark");
    document.documentElement.setAttribute("data-default-accent", "mayur");
    expect(readAppearance()).toEqual({ theme: "dark", accent: "mayur", shape: "square" });
    localStorage.setItem("kalaa.theme", JSON.stringify({ theme: "light" }));
    expect(readAppearance().theme).toBe("light");
    document.documentElement.removeAttribute("data-default-theme");
    document.documentElement.removeAttribute("data-default-accent");
  });

  it("syncs useAppearance across components and storage events", async () => {
    const user = userEvent.setup();
    render(
      <>
        <HookProbe />
        <AppearanceMenu open />
      </>,
    );

    expect(screen.getByTestId("probe")).toHaveTextContent("auto:neel:square");

    await user.click(screen.getByRole("button", { name: "Apply Mayur Dark Soft" }));
    expect(screen.getByTestId("probe")).toHaveTextContent("dark:mayur:soft");
    expect(screen.getByRole("radio", { name: "Dark" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Mayur" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Soft" })).toBeChecked();

    localStorage.setItem("kalaa.theme", JSON.stringify({ theme: "light", accent: "geru", shape: "square" }));
    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "kalaa.theme" }));
    });

    expect(screen.getByTestId("probe")).toHaveTextContent("light:geru:square");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(document.documentElement).toHaveAttribute("data-accent", "geru");
    expect(document.documentElement).toHaveAttribute("data-shape", "square");

    applyAppearance({ theme: "auto", accent: "neel", shape: "square" });
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });
});

describe("@kalaa/tokens/theme.js and @kalaa/tokens/theme-picker.js", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-accent");
    document.documentElement.removeAttribute("data-shape");
    document.head.innerHTML = '<meta name="color-scheme" content="dark light">';
    window.KalaaTheme?.set({ theme: "auto", accent: "neel", shape: "square" });
  });

  it("invalid stored values fall back to defaults", () => {
    localStorage.setItem(
      "kalaa.theme",
      JSON.stringify({ theme: "solarized", accent: "pink", shape: "octagon" }),
    );
    window.dispatchEvent(new StorageEvent("storage", { key: "kalaa.theme" }));

    expect(window.KalaaTheme?.get()).toEqual({
      theme: "auto",
      accent: "neel",
      shape: "square",
    });
    expect(document.documentElement).not.toHaveAttribute("data-theme");
    expect(document.documentElement).toHaveAttribute("data-accent", "neel");
    expect(document.documentElement).toHaveAttribute("data-shape", "square");

    localStorage.setItem("kalaa.theme", "not-json{{{");
    window.dispatchEvent(new StorageEvent("storage", { key: "kalaa.theme" }));
    expect(window.KalaaTheme?.get()).toEqual({
      theme: "auto",
      accent: "neel",
      shape: "square",
    });
  });

  it("auto removes data-theme and restores color-scheme meta", () => {
    window.KalaaTheme?.set({ theme: "dark" });
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.querySelector('meta[name="color-scheme"]')).toHaveAttribute("content", "dark");

    window.KalaaTheme?.set({ theme: "auto" });
    expect(document.documentElement).not.toHaveAttribute("data-theme");
    expect(document.querySelector('meta[name="color-scheme"]')).toHaveAttribute("content", "dark light");
  });

  it("set() persists to localStorage and notifies onChange listeners", () => {
    const listener = vi.fn();
    const unsub = window.KalaaTheme?.onChange(listener);

    window.KalaaTheme?.set({ theme: "light", accent: "geru", shape: "soft" });

    expect(JSON.parse(localStorage.getItem("kalaa.theme") || "{}")).toEqual({
      theme: "light",
      accent: "geru",
      shape: "soft",
    });
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(document.documentElement).toHaveAttribute("data-accent", "geru");
    expect(document.documentElement).toHaveAttribute("data-shape", "soft");
    expect(listener).toHaveBeenCalledWith({
      theme: "light",
      accent: "geru",
      shape: "soft",
    });
    if (typeof unsub === "function") unsub();
  });

  it("storage event syncs state, DOM attributes and listeners", () => {
    const listener = vi.fn();
    const unsub = window.KalaaTheme?.onChange(listener);

    localStorage.setItem("kalaa.theme", JSON.stringify({ theme: "dark", accent: "mayur", shape: "soft" }));
    window.dispatchEvent(new StorageEvent("storage", { key: "kalaa.theme" }));

    expect(window.KalaaTheme?.get()).toEqual({
      theme: "dark",
      accent: "mayur",
      shape: "soft",
    });
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.documentElement).toHaveAttribute("data-accent", "mayur");
    expect(document.documentElement).toHaveAttribute("data-shape", "soft");
    expect(listener).toHaveBeenCalledWith({
      theme: "dark",
      accent: "mayur",
      shape: "soft",
    });
    if (typeof unsub === "function") unsub();
  });

  it("theme-picker.js registers custom element and supports keyboard and click selection", () => {
    expect(customElements.get("kalaa-theme-picker")).toBeTruthy();

    const el = document.createElement("kalaa-theme-picker");
    document.body.appendChild(el);

    const shadow = el.shadowRoot!;
    expect(shadow).toBeTruthy();
    const trigger = shadow.querySelector<HTMLButtonElement>(".trigger")!;
    const menu = shadow.querySelector<HTMLElement>(".menu")!;
    expect(menu.hidden).toBe(true);

    trigger.click();
    expect(menu.hidden).toBe(false);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const autoBtn = shadow.querySelector<HTMLButtonElement>('.opt[data-key="theme"][data-val="auto"]')!;
    expect(autoBtn).toHaveAttribute("aria-checked", "true");

    fireEvent.keyDown(autoBtn, { key: "ArrowRight" });
    expect(window.KalaaTheme?.get().theme).toBe("light");

    const geruBtn = shadow.querySelector<HTMLButtonElement>('.opt[data-key="accent"][data-val="geru"]')!;
    geruBtn.click();
    expect(window.KalaaTheme?.get().accent).toBe("geru");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(menu.hidden).toBe(true);

    el.remove();
  });
});
