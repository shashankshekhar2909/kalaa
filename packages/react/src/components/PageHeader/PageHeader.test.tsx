import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "./PageHeader";
describe("PageHeader", () => {
  it("renders its content and supports a custom router element on back", () => {
    render(
      <PageHeader
        title="Products"
        back={{
          href: "/catalog",
          label: "Back to catalog",
          render: <a href="/catalog" data-router="next" />,
        }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Products" })).toBeInTheDocument();
    const back = screen.getByRole("link", { name: "Back to catalog" });
    expect(back).toHaveAttribute("data-router", "next");
    expect(back).toHaveClass("kl-page-header__back");
  });
});
