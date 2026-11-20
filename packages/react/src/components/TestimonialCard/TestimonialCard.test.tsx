import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialCard } from "./TestimonialCard";

describe("TestimonialCard", () => {
  it("renders quote, author, role, org and time element", () => {
    const { container } = render(
      <TestimonialCard
        quote="Cut dispatch training time in half."
        author="Meera Kulkarni"
        role="VP of Engineering"
        org="Vayu Grid Systems"
        date="2026-02"
      />,
    );
    expect(screen.getByText(/Cut dispatch training time in half/)).toBeInTheDocument();
    expect(screen.getByText("Meera Kulkarni")).toBeInTheDocument();
    expect(screen.getByText(/VP of Engineering · Vayu Grid Systems/)).toBeInTheDocument();
    expect(container.querySelector("time")).toHaveAttribute("dateTime", "2026-02");
  });
});
