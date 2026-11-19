import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./Logo";
describe("Logo", () => {
  it("names the mark Kalaa by default and accepts a custom title", () => {
    const { rerender } = render(<Logo />);
    expect(screen.getByRole("img", { name: "Kalaa" })).toBeInTheDocument();
    rerender(<Logo title="Kalaa home" />);
    expect(screen.getByRole("img", { name: "Kalaa home" })).toBeInTheDocument();
  });
  it("shows the wordmark in the lockup without a duplicate image name", () => {
    const { container } = render(<Logo variant="lockup" />);
    expect(screen.getByText("Kalaa")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
  it("sizes from the size prop and merges className", () => {
    const { container } = render(<Logo size={48} className="custom" />);
    expect(container.firstChild).toHaveStyle({ fontSize: "48px" });
    expect(container.firstChild).toHaveClass("kl-logo", "custom");
  });
  it("uses only fills from role tokens, or currentColor in mono", () => {
    const { container, rerender } = render(<Logo />);
    expect(container.querySelectorAll("path[stroke]")).toHaveLength(0);
    expect(container.querySelector(".kl-logo__frame--mono")).toBeNull();
    rerender(<Logo mono />);
    expect(container.querySelectorAll(".kl-logo__frame--mono, .kl-logo__lit--mono")).toHaveLength(2);
  });
});
