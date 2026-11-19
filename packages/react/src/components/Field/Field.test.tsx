import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Field } from "./Field";
import { Input } from "../Input/Input";
describe("Field", () => {
  it("connects label, hint and error to the control", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Field label="Product" hint="Use a title" error="Required" required>
        <Input ref={ref} className="custom" />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Product (required)" });
    expect(input).toHaveAccessibleDescription("Use a title Required");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveClass("custom");
    expect(ref.current).toBe(input);
  });
});
