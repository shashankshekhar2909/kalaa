import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Dialog } from "./Dialog";
it("opens and closes with Escape", async () => {
  render(
    <Dialog trigger={<button>Review</button>} title="Review import">
      Check products
    </Dialog>,
  );
  const trigger = screen.getByRole("button", { name: "Review" });
  await userEvent.click(trigger);
  expect(screen.getByRole("dialog", { name: "Review import" })).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

it("forwards class and ref to the named popup", () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <Dialog defaultOpen title="Review import" description="Check products" ref={ref} className="custom">
      Ready
    </Dialog>,
  );
  const dialog = screen.getByRole("dialog", { name: "Review import" });
  expect(dialog).toHaveAccessibleDescription("Check products");
  expect(dialog).toHaveClass("custom");
  expect(ref.current).toBe(dialog);
});

it("closes with the Close button and returns focus to the trigger", async () => {
  render(
    <Dialog trigger={<button>Review</button>} title="Review import">
      Check products
    </Dialog>,
  );
  const trigger = screen.getByRole("button", { name: "Review" });
  await userEvent.click(trigger);
  await userEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
