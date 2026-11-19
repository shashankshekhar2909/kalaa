import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "./Dialog";
it("opens and closes with Escape", async () => {
  render(
    <Dialog trigger={<button>Review</button>} title="Review import">
      Check products
    </Dialog>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Review" }));
  expect(screen.getByRole("dialog", { name: "Review import" })).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
