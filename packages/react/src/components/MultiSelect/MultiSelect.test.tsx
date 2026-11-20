import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MultiSelect } from "./MultiSelect";
const options = [
  { value: "sku", label: "SKU code" },
  { value: "ean", label: "EAN-13 barcode" },
  { value: "title", label: "Product title" },
];
describe("MultiSelect", () => {
  it("renders selected values as removable chips and filters options to add more", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const ref = createRef<HTMLInputElement>();
    render(
      <MultiSelect
        ref={ref}
        aria-label="Mapped columns"
        options={options}
        defaultValue={["sku"]}
        onValueChange={onValueChange}
        className="custom"
      />,
    );
    expect(screen.getByText("SKU code")).toBeInTheDocument();
    const input = screen.getByRole("combobox", { name: "Mapped columns" });
    expect(ref.current).toBe(input);
    await user.click(input);
    await user.type(input, "EAN");
    await user.click(screen.getByRole("option", { name: "EAN-13 barcode" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["sku", "ean"]);
    await user.click(screen.getByRole("button", { name: "Remove SKU code" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["ean"]);
  });
});
