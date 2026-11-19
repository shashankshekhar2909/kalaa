import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";
describe("EmptyState", () => {
  it("renders its content", () => {
    render(<EmptyState title="No products" />);
    expect(screen.getByRole("heading", { name: "No products" })).toBeInTheDocument();
  });
});
