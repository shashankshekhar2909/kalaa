import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, ButtonLink } from "./Button";
describe("Button", () => {
  it("supports keyboard activation and passes its ref and class", async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="custom" onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    await userEvent.tab();
    await userEvent.keyboard("{Enter} ");
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(ref.current).toBe(button);
    expect(button).toHaveClass("custom");
    expect(button).toHaveAttribute("type", "button");
  });
  it("disables and marks loading buttons busy", () => {
    render(<Button loading>Import</Button>);
    expect(screen.getByRole("button", { name: "Import" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Import" })).toHaveAttribute("aria-busy", "true");
  });
  it("renders a link", () => {
    render(<ButtonLink href="/products">Products</ButtonLink>);
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute("href", "/products");
  });
});

describe("Button variants", () => {
  it("applies variant and size classes and does not fire when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button variant="danger" size="sm" disabled onClick={onClick}>
        Delete
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveClass("kl-button--danger", "kl-button--sm");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
  it("does not fire while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Import
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Import" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
