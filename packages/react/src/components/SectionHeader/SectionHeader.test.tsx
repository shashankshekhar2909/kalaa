import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeader } from "./SectionHeader";

describe("SectionHeader", () => {
  it("renders title, description, badge and action link", () => {
    render(
      <SectionHeader
        title="Engineered for predictable operations"
        description="Schema-validated layers."
        badge="Architecture"
        action={{ label: "Read docs", href: "#docs" }}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Engineered for predictable operations" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Architecture")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read docs" })).toHaveAttribute("href", "#docs");
  });
});
