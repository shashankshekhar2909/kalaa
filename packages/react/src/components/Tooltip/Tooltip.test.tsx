import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../Button/Button";
import { Tooltip } from "./Tooltip";
describe("Tooltip", () => {
  it("renders popup content when open and dismisses with Escape", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Export filtered rows" defaultOpen className="custom">
        <Button>Export</Button>
      </Tooltip>,
    );
    const popup = screen.getByText("Export filtered rows");
    expect(popup).toHaveClass("kl-tooltip", "custom");
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Export filtered rows")).not.toBeInTheDocument();
  });
});
