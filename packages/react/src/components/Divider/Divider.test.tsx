import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "./Divider";
describe("Divider", () => {
  it("renders a separator with optional label and vertical orientation", () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(<Divider ref={ref} label="Section" className="custom" />);
    const sep = screen.getByRole("separator");
    expect(sep).toHaveTextContent("Section");
    expect(sep).toHaveClass("kl-divider", "kl-divider--horizontal", "kl-divider--labeled", "custom");
    expect(ref.current).toBe(sep);
    rerender(<Divider orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });
  it("omits the separator role when decorative", () => {
    render(<Divider decorative />);
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });
});
