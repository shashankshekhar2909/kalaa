import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkillGroups } from "./SkillGroups";

describe("SkillGroups", () => {
  it("renders skill categories and badges", () => {
    render(
      <SkillGroups
        groups={[
          { category: "Systems", skills: ["Rust", "Go"] },
          { category: "Frontend", skills: ["React 19", "TypeScript"] },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Skills" })).toBeInTheDocument();
    expect(screen.getByText("Systems")).toBeInTheDocument();
    expect(screen.getByText("Rust")).toBeInTheDocument();
    expect(screen.getByText("React 19")).toBeInTheDocument();
  });
});
