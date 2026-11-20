import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Summary } from "./Summary";

describe("Summary", () => {
  it("renders heading, summary paragraph and highlights", () => {
    render(
      <Summary
        heading="Summary"
        text="Systems architect building telemetry pipelines."
        highlights={["1.4M events/s sustained", "Zero WCAG 2.2 AA defects"]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Summary" })).toBeInTheDocument();
    expect(screen.getByText("Systems architect building telemetry pipelines.")).toBeInTheDocument();
    expect(screen.getByText("1.4M events/s sustained")).toBeInTheDocument();
  });

  it("supports custom headingLevel", () => {
    render(<Summary heading="Overview" text="Short summary." headingLevel={3} />);
    expect(screen.getByRole("heading", { level: 3, name: "Overview" })).toBeInTheDocument();
  });
});
