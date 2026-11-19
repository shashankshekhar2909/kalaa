import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";
it("toggles with the keyboard", async () => {
  render(<Checkbox label="Include drafts" />);
  const box = screen.getByRole("checkbox", { name: "Include drafts" });
  await userEvent.tab();
  await userEvent.keyboard(" ");
  expect(box).toBeChecked();
});
