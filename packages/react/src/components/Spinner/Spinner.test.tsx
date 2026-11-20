import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner";
describe("Spinner", () => {
  it("announces status with an accessible label and forwards ref and class", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} size="lg" label="Importing catalog" className="custom" />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Importing catalog");
    expect(status).toHaveClass("kl-spinner", "kl-spinner--lg", "custom");
    expect(ref.current).toBe(status);
  });
  it("hides decorative spinners from assistive technologies", () => {
    const { container } = render(<Spinner decorative />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});
