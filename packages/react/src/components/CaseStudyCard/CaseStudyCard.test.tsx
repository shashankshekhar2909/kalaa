import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CaseStudyCard } from "./CaseStudyCard";

describe("CaseStudyCard", () => {
  it("renders title, client, time year, challenge, outcome, metrics and action link", () => {
    const { container } = render(
      <CaseStudyCard
        title="Substation telemetry pipeline overhaul"
        client="Vayu Grid Systems"
        year="2025"
        summary="Replaced polling collector."
        challenge="14-minute failover stalls."
        outcome="22-second regional failover."
        metrics={[{ label: "Recovery time", value: "22 s" }]}
        tags={["Rust"]}
        href="#case-1"
        ctaLabel="Read telemetry case study"
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Substation telemetry pipeline overhaul" }),
    ).toBeInTheDocument();
    expect(screen.getByText("14-minute failover stalls.")).toBeInTheDocument();
    expect(screen.getByText("22-second regional failover.")).toBeInTheDocument();
    expect(screen.getByText("22 s")).toBeInTheDocument();
    expect(container.querySelector("time")).toHaveAttribute("dateTime", "2025");
    expect(screen.getByRole("link", { name: "Read telemetry case study" })).toHaveAttribute(
      "href",
      "#case-1",
    );
  });
});
