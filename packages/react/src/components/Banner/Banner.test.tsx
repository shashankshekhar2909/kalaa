import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Banner } from "./Banner";
describe("Banner", () => {
  it("renders its content", () => {
    render(
      <Banner tone="warning" title="Review">
        Check products
      </Banner>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
