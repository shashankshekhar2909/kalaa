import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Field } from "../Field/Field";
import { Select } from "./Select";
describe("Select", () => {
  it("connects field descriptions and forwards class and ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Field label="Product" hint="Catalog details" error="Required">
        <Select
          options={[
            { value: "draft", label: "Draft" },
            { value: "review", label: "Needs review" },
          ]}
          className="custom"
          ref={ref}
        />
      </Field>,
    );
    const control = screen.getByRole("combobox", { name: "Product" });
    expect(control).toHaveAccessibleDescription("Catalog details Required");
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveClass("custom");
    expect(ref.current).toBe(control);
  });
  it("disables the control", () => {
    render(
      <Select
        options={[
          { value: "draft", label: "Draft" },
          { value: "review", label: "Needs review" },
        ]}
        aria-label="Product"
        disabled
      />,
    );
    expect(screen.getByRole("combobox", { name: "Product" })).toBeDisabled();
  });

  it("opens with the keyboard and selects an option", async () => {
    const user = userEvent.setup();
    render(
      <Select
        aria-label="Status"
        options={[
          { value: "draft", label: "Draft" },
          { value: "review", label: "Needs review" },
        ]}
      />,
    );
    await user.tab();
    await user.keyboard("{Enter}");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveTextContent("Needs review");
  });
});

describe("Select keyboard", () => {
  it("closes the list with Escape without changing the value", async () => {
    const user = userEvent.setup();
    render(
      <Select
        aria-label="Status"
        options={[
          { value: "draft", label: "Draft" },
          { value: "review", label: "Needs review" },
        ]}
        defaultValue="draft"
      />,
    );
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveTextContent("Draft");
  });
});
