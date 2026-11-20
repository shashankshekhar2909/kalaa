import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Languages } from "./Languages";

describe("Languages", () => {
  it("renders language names and proficiency badges", () => {
    render(
      <Languages
        items={[
          { language: "Marathi", proficiency: "Native or bilingual", level: "native" },
          { language: "English", proficiency: "Full professional proficiency", level: "fluent" },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Languages" })).toBeInTheDocument();
    expect(screen.getByText("Marathi")).toBeInTheDocument();
    expect(screen.getByText("Native or bilingual")).toBeInTheDocument();
  });
});
