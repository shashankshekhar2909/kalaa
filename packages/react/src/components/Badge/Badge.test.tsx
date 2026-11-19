import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./Badge";
describe("StatusBadge", () => {
  it("maps known and unknown statuses", () => {
    render(
      <>
        <StatusBadge status="NEEDS REVIEW" />
        <StatusBadge status="other" />
      </>,
    );
    expect(screen.getByText("Needs review")).toHaveClass("kl-badge--warning");
    expect(screen.getByText("Other")).toHaveClass("kl-badge--neutral");
  });
});
