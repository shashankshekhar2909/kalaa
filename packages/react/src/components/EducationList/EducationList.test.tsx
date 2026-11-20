import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EducationList } from "./EducationList";

describe("EducationList", () => {
  it("renders degree, institution, time tags and honors badges", () => {
    const { container } = render(
      <EducationList
        items={[
          {
            degree: "M.Tech in Computer Science",
            institution: "Visvesvaraya Institute of Technology",
            startDate: "2014",
            endDate: "2016",
            honors: ["Gold Medal"],
          },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Education" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "M.Tech in Computer Science" })).toBeInTheDocument();
    expect(screen.getByText("Gold Medal")).toBeInTheDocument();
    expect(container.querySelectorAll("time")).toHaveLength(2);
  });
});
