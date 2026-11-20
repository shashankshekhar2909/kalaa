import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Field } from "../Field/Field";
import { Combobox } from "./Combobox";
const options = [
  { value: "beverages", label: "Beverages" },
  { value: "spices", label: "Spices" },
];
describe("Combobox", () => {
  it("filters options by typing and selects with keyboard, forwarding ref and Field descriptions", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const ref = createRef<HTMLInputElement>();
    render(
      <Field label="Category" hint="Primary taxonomy">
        <Combobox ref={ref} options={options} onValueChange={onValueChange} className="custom" />
      </Field>,
    );
    const input = screen.getByRole("combobox", { name: "Category" });
    expect(input).toHaveAccessibleDescription("Primary taxonomy");
    expect(input).toHaveClass("kl-combobox__input", "custom");
    expect(ref.current).toBe(input);
    await user.click(input);
    await user.type(input, "Spi");
    await user.click(screen.getByRole("option", { name: "Spices" }));
    expect(onValueChange).toHaveBeenCalledWith("spices");
  });
});
