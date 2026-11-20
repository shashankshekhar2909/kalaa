import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "./Breadcrumbs";
describe("Breadcrumbs", () => {
  it("renders a breadcrumb nav, marks the current page and supports custom router links", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Breadcrumbs
        ref={ref}
        className="custom"
        items={[
          { label: "Catalog", render: <a href="/catalog" data-router="next" /> },
          { label: "Imports", href: "/catalog/imports" },
          { label: "Batch #1042" },
        ]}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toHaveClass("kl-breadcrumbs", "custom");
    expect(ref.current).toBe(nav);
    const first = screen.getByRole("link", { name: "Catalog" });
    expect(first).toHaveAttribute("data-router", "next");
    expect(screen.getByText("Batch #1042")).toHaveAttribute("aria-current", "page");
  });
});
