import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Checkbox } from "./Checkbox";
it("toggles with the keyboard", async () => {
  render(<Checkbox label="Include drafts" />);
  const box = screen.getByRole("checkbox", { name: "Include drafts" });
  await userEvent.tab();
  await userEvent.keyboard(" ");
  expect(box).toBeChecked();
});

it("forwards class and ref, describes the control, and respects disabled state", async () => {
  const ref = createRef<HTMLButtonElement>();
  render(
    <Checkbox
      label="Catalog setting"
      description="Applies to imports"
      disabled
      defaultChecked
      className="custom"
      ref={ref}
    />,
  );
  const control = screen.getByRole("checkbox", { name: "Catalog setting" });
  expect(control).toHaveAccessibleDescription("Applies to imports");
  expect(control).toHaveAttribute("aria-disabled", "true");
  expect(control).toBeChecked();
  expect(control).toHaveClass("custom");
  expect(ref.current).toBe(control);
});

it("exposes the indeterminate state", () => {
  render(<Checkbox label="Select all products" indeterminate />);
  expect(screen.getByRole("checkbox", { name: "Select all products" })).toHaveAttribute(
    "aria-checked",
    "mixed",
  );
});

it("toggles on click and ignores clicks when disabled", async () => {
  render(
    <>
      <Checkbox label="Publish" />
      <Checkbox label="Archive" disabled />
    </>,
  );
  const publish = screen.getByRole("checkbox", { name: "Publish" });
  await userEvent.click(publish);
  expect(publish).toBeChecked();
  const archive = screen.getByRole("checkbox", { name: "Archive" });
  await userEvent.click(archive);
  expect(archive).not.toBeChecked();
});
