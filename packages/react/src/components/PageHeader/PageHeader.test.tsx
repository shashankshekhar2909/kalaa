import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "./PageHeader";
describe("PageHeader", () => {
  it("renders its content", () => {
    render(<PageHeader title="Products" />);
    expect(screen.getByRole("heading", { name: "Products" })).toBeInTheDocument();
  });
});
