import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Field } from "../Field/Field";
import { Input } from "./Input";
describe("Input", () => {
  it("connects field descriptions and forwards class and ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Field label="Product" hint="Catalog details" error="Required">
        <Input className="custom" ref={ref} />
      </Field>,
    );
    const control = screen.getByRole("textbox", { name: "Product" });
    expect(control).toHaveAccessibleDescription("Catalog details Required");
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveClass("custom");
    expect(ref.current).toBe(control);
  });
  it("disables the control", () => {
    render(<Input aria-label="Product" disabled />);
    expect(screen.getByRole("textbox", { name: "Product" })).toBeDisabled();
  });

  it("accepts keyboard input", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Product" />);
    await user.tab();
    await user.keyboard("Catalog");
    expect(screen.getByRole("textbox", { name: "Product" })).toHaveValue("Catalog");
  });
});
