import { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";
describe("Skeleton", () => {
  it("renders an aria-hidden placeholder with variant, dimensions, class and ref", () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(
      <Skeleton ref={ref} variant="block" width={200} height={48} className="custom" />,
    );
    const el = container.firstChild as HTMLSpanElement;
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveClass("kl-skeleton", "kl-skeleton--block", "custom");
    expect(el).toHaveStyle({ width: "200px", height: "48px" });
    expect(ref.current).toBe(el);
  });
});
