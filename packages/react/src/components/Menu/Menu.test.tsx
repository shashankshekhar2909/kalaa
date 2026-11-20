import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button/Button";
import { Menu } from "./Menu";
describe("Menu", () => {
  it("opens with keyboard, activates an item and supports danger tone and separators", async () => {
    const user = userEvent.setup();
    const onDuplicate = vi.fn();
    render(
      <Menu
        trigger={<Button>Actions</Button>}
        items={[
          { label: "Duplicate", onSelect: onDuplicate },
          { type: "separator" },
          { label: "Delete", tone: "danger" },
        ]}
      />,
    );
    await user.tab();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveClass("kl-menu__item--danger");
    await user.click(screen.getByRole("menuitem", { name: "Duplicate" }));
    expect(onDuplicate).toHaveBeenCalledTimes(1);
  });
});
