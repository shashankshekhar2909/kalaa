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
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute("aria-current", "page");
  });
});
