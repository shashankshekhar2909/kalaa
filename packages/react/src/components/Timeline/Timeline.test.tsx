import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Timeline } from "./Timeline";

describe("Timeline", () => {
  it("renders ordered list of milestones with time tags and badges", () => {
    const { container } = render(
      <Timeline
        items={[
          {
            date: "2023-04",
            endDate: "Present",
            title: "Principal Systems Architect",
            subtitle: "Vayu Grid Systems",
            badge: "Current",
          },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Timeline" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Principal Systems Architect" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
    expect(container.querySelector("time")).toHaveAttribute("dateTime", "2023-04");
  });
});
