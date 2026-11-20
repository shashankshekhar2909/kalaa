import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CTA } from "./CTA";

describe("CTA", () => {
  it("renders heading, description, note and action links", () => {
    render(
      <CTA
        title="Ready to calm your telemetry stack?"
        description="Run the simulator locally."
        note="Air-gap compatible."
        primaryAction={{ label: "Download tarball", href: "#download" }}
        secondaryAction={{ label: "Talk to an architect", href: "#contact" }}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Ready to calm your telemetry stack?" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Air-gap compatible.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Download tarball" })).toHaveAttribute("href", "#download");
  });
});
