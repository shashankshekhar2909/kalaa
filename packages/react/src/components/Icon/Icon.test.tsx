import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon, iconNames } from "./Icon";
describe("Icon", () => {
  it("renders all 24 curated icons as decorative SVGs by default", () => {
    expect(iconNames.length).toBeGreaterThanOrEqual(24);
    const { container } = render(<Icon name="search" size="sm" className="custom" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("kl-icon", "kl-icon--sm", "custom");
  });
  it("exposes role=img when given an accessible label and forwards ref", () => {
    const ref = createRef<SVGSVGElement>();
    render(<Icon ref={ref} name="warning" label="Needs review" />);
    const img = screen.getByRole("img", { name: "Needs review" });
    expect(img).not.toHaveAttribute("aria-hidden");
    expect(ref.current).toBe(img);
  });
});
