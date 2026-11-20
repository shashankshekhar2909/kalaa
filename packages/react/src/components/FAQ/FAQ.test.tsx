import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FAQ } from "./FAQ";

describe("FAQ", () => {
  it("renders native details/summary disclosures", () => {
    render(
      <FAQ
        items={[
          {
            question: "Does it work without JS?",
            answer: "Yes, via native HTML details elements.",
          },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Frequently asked questions" })).toBeInTheDocument();
    expect(screen.getByText("Does it work without JS?")).toBeInTheDocument();
    expect(screen.getByText("Yes, via native HTML details elements.")).toBeInTheDocument();
  });
});
