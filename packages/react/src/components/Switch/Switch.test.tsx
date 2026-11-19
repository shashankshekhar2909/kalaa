import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";
it("toggles with the keyboard", async () => {
  render(<Switch label="Enable imports" />);
  const control = screen.getByRole("switch", { name: "Enable imports" });
  await userEvent.tab();
  await userEvent.keyboard(" ");
  expect(control).toBeChecked();
});
