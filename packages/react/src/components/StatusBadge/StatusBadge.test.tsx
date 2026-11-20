import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { StatusBadge } from "./StatusBadge";
it.each([
  ["in progress", "info"],
  ["In Progress", "info"],
  ["approved", "success"],
  ["needs review", "warning"],
  ["failed", "danger"],
  ["something else", "neutral"],
])("maps %s to %s", (status, tone) => {
  render(<StatusBadge status={status} />);
  expect(screen.getByText(new RegExp(`^${status}$`, "i"))).toHaveClass(`kl-badge--${tone}`);
});
