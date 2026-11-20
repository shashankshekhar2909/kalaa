import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../Button/Button";
import { Popover } from "./Popover";
describe("Popover", () => {
  it("opens on trigger click, closes on Escape and forwards ref and class", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover
        ref={ref}
        trigger={<Button>Inspect batch</Button>}
        title="Batch details"
        description="Parsed 128 rows"
        className="custom"
      >
        4 rows need attention
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "Inspect batch" }));
    const dialog = screen.getByRole("dialog", { name: "Batch details" });
    expect(dialog).toHaveClass("kl-popover", "custom");
    expect(ref.current).toBe(dialog);
    expect(screen.getByText("4 rows need attention")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
