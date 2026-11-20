import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";
describe("AppShell", () => {
  it("toggles navigation and marks the active page", async () => {
    render(
      <AppShell
        nav={
          <AppShell.NavItem href="/products" active>
            Products
          </AppShell.NavItem>
        }
      >
        Catalog
      </AppShell>,
    );
    const menu = screen.getByRole("button", { name: "Menu" });
    await userEvent.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    const link = screen.getByRole("link", { name: "Products" });
    expect(link).toHaveAttribute("aria-current", "page");
    await userEvent.click(link);
    expect(menu).toHaveAttribute("aria-expanded", "false");
  });
  it("renders brand, footer and custom router link via render prop, and closes on Escape", async () => {
    render(
      <AppShell
        brand={<span>Catalog Admin</span>}
        nav={
          <AppShell.NavItem render={<a href="/imports" data-router="next" />} icon={<span>*</span>}>
            Imports
          </AppShell.NavItem>
        }
        footer={<button type="button">Sign out</button>}
      >
        Body
      </AppShell>,
    );
    expect(screen.getByText("Catalog Admin")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Imports" });
    expect(link).toHaveAttribute("data-router", "next");
    expect(link).toHaveClass("kl-app-shell__nav-item");
    const menu = screen.getByRole("button", { name: "Menu" });
    await userEvent.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    expect(menu).toHaveAttribute("aria-expanded", "false");
  });
});
