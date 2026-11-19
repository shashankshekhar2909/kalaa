import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Switch } from "./Switch";
it("toggles with the keyboard", async () => {
  render(<Switch label="Enable imports" />);
  const control = screen.getByRole("switch", { name: "Enable imports" });
  await userEvent.tab();
  await userEvent.keyboard(" ");
  expect(control).toBeChecked();
});

it("forwards class and ref, describes the control, and respects disabled state", async () => {
  const ref = createRef<HTMLButtonElement>();
  render(
    <Switch
      label="Catalog setting"
      description="Applies to imports"
      disabled
      defaultChecked
      className="custom"
      ref={ref}
    />,
  );
  const control = screen.getByRole("switch", { name: "Catalog setting" });
  expect(control).toHaveAccessibleDescription("Applies to imports");
  expect(control).toHaveAttribute("aria-disabled", "true");
  expect(control).toBeChecked();
  expect(control).toHaveClass("custom");
  expect(ref.current).toBe(control);
});

it("toggles on click and reports its checked state", async () => {
  render(<Switch label="Auto sync" />);
  const control = screen.getByRole("switch", { name: "Auto sync" });
  expect(control).not.toBeChecked();
  await userEvent.click(control);
  expect(control).toBeChecked();
  await userEvent.click(control);
  expect(control).not.toBeChecked();
});

it("does not toggle when disabled", async () => {
  render(<Switch label="Auto sync" disabled />);
  const control = screen.getByRole("switch", { name: "Auto sync" });
  await userEvent.click(control);
  expect(control).not.toBeChecked();
});
