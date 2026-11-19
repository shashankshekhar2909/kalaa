import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Field } from "../Field/Field";
import { Textarea } from "./Textarea";
describe("Textarea", () => {
  it("connects field descriptions and forwards class and ref", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(
      <Field label="Product" hint="Catalog details" error="Required">
        <Textarea className="custom" ref={ref} />
      </Field>,
    );
    const control = screen.getByRole("textbox", { name: "Product" });
    expect(control).toHaveAccessibleDescription("Catalog details Required");
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveClass("custom");
    expect(ref.current).toBe(control);
  });
  it("disables the control", () => {
    render(<Textarea aria-label="Product" disabled />);
    expect(screen.getByRole("textbox", { name: "Product" })).toBeDisabled();
  });

  it("accepts keyboard input", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Product" />);
    await user.tab();
    await user.keyboard("Catalog");
    expect(screen.getByRole("textbox", { name: "Product" })).toHaveValue("Catalog");
  });
});
