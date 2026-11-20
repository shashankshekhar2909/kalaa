import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "./Slider";
describe("Slider", () => {
  it("associates its label, updates via change and forwards ref and class", () => {
    const onValueChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <Slider
        ref={ref}
        label="Match threshold"
        defaultValue={70}
        step={5}
        onValueChange={onValueChange}
        className="custom"
      />,
    );
    const slider = screen.getByRole("slider", { name: "Match threshold" });
    expect(slider).toHaveValue("70");
    expect(ref.current).toHaveClass("kl-slider", "custom");
    fireEvent.change(slider, { target: { value: "75" } });
    expect(onValueChange).toHaveBeenCalledWith(75);
  });
  it("respects disabled state", () => {
    render(<Slider label="Match threshold" defaultValue={50} disabled />);
    expect(screen.getByRole("slider", { name: "Match threshold" })).toBeDisabled();
  });
});
