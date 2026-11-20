import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExperienceItem, ExperienceList } from "./ExperienceList";

describe("ExperienceList and ExperienceItem", () => {
  it("renders section heading, ordered item headings, time elements and tech tags", () => {
    const { container } = render(
      <ExperienceList
        items={[
          {
            role: "Principal Systems Architect",
            org: "Vayu Grid Systems",
            location: "Pune, India",
            startDate: "2023-04",
            endDate: "Present",
            bullets: ["Re-architected the substation event ingestion pipeline."],
            tags: ["Rust", "Go"],
          },
          {
            role: "Staff Platform Engineer",
            org: "Narmada Cloud Labs",
            startDate: "2019-07",
            endDate: "2023-03",
            bullets: ["Designed a deterministic schema-validation gateway."],
          },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Experience" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Principal Systems Architect" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Rust")).toBeInTheDocument();
    const times = container.querySelectorAll("time");
    expect(times).toHaveLength(3);
    expect(times[0]).toHaveAttribute("dateTime", "2023-04");
    expect(times[1]).toHaveAttribute("dateTime", "2019-07");
    expect(times[2]).toHaveAttribute("dateTime", "2023-03");
  });

  it("renders standalone ExperienceItem with configurable headingLevel", () => {
    render(
      <ExperienceItem
        role="Senior Engineer"
        org="Deccan Telemetry"
        startDate="2016-06"
        endDate="2019-06"
        bullets={["Built edge collectors."]}
        headingLevel={2}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Senior Engineer" })).toBeInTheDocument();
  });
});
