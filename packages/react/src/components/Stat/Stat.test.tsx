import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stat } from "./Stat";
describe("Stat", () => {
  it("renders label, value, delta with tone and help text", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Stat
        ref={ref}
        label="Products approved"
        value="1,284"
        delta="+6.4%"
        deltaTone="success"
        help="Last 7 days"
        className="custom"
      />,
    );
    expect(screen.getByText("Products approved")).toBeInTheDocument();
    expect(screen.getByText("1,284")).toBeInTheDocument();
    expect(screen.getByText("+6.4%")).toHaveClass("kl-stat__delta--success");
    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
    expect(ref.current).toHaveClass("kl-stat", "custom");
  });
});
