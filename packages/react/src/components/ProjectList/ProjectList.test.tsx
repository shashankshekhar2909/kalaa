import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard, ProjectList } from "./ProjectList";

describe("ProjectList and ProjectCard", () => {
  it("renders projects with impact metrics, tags and links", () => {
    render(
      <ProjectList
        items={[
          {
            name: "Pravah Stream Compactor",
            role: "Creator",
            startDate: "2024",
            endDate: "Present",
            description: "Bounded-memory compactor.",
            impact: [{ label: "Write amplification", value: "1.18x" }],
            tags: ["Rust"],
            links: [{ label: "Source", href: "https://github.example.invalid/pravah" }],
          },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Pravah Stream Compactor" })).toBeInTheDocument();
    expect(screen.getByText("Write amplification")).toBeInTheDocument();
    expect(screen.getByText("1.18x")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Source" })).toHaveAttribute(
      "href",
      "https://github.example.invalid/pravah",
    );
  });

  it("renders standalone ProjectCard", () => {
    render(<ProjectCard name="Drishti" description="Operator console." />);
    expect(screen.getByRole("heading", { level: 2, name: "Drishti" })).toBeInTheDocument();
  });
});
