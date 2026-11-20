import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageFooter } from "./PageFooter";

describe("PageFooter", () => {
  it("renders footer landmark, brand name, navigation columns and copyright", () => {
    render(
      <PageFooter
        brandName="Pravah Telemetry"
        tagline="Calm infrastructure."
        columns={[{ heading: "Product", links: [{ label: "Benchmarks", href: "#stats" }] }]}
        copyright="© 2026 Pravah Telemetry."
      />,
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("Pravah Telemetry")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Product footer links" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Benchmarks" })).toHaveAttribute("href", "#stats");
  });
});
