import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Link } from "./Link";
describe("Link", () => {
  it("renders an anchor with class and ref", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link ref={ref} href="/imports" className="custom">
        Import history
      </Link>,
    );
    const link = screen.getByRole("link", { name: "Import history" });
    expect(link).toHaveAttribute("href", "/imports");
    expect(link).toHaveClass("kl-link", "custom");
    expect(ref.current).toBe(link);
  });
  it("composes with a router link via the render prop", () => {
    render(<Link render={<a href="/products" data-router="next" />}>Products</Link>);
    const link = screen.getByRole("link", { name: "Products" });
    expect(link).toHaveAttribute("data-router", "next");
    expect(link).toHaveClass("kl-link");
  });
});
