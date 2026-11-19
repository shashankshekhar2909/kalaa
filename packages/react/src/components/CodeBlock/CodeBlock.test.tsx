import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./CodeBlock";
afterEach(() => vi.restoreAllMocks());
describe("CodeBlock", () => {
  it("shows the code in a labelled, keyboard-scrollable region", () => {
    render(<CodeBlock code="pnpm add @kalaa/react" label="Install command" />);
    expect(screen.getByRole("group", { name: "Install command" })).toBeInTheDocument();
    const code = screen.getByText("pnpm add @kalaa/react");
    expect(code.closest("pre")).toHaveAttribute("tabindex", "0");
  });
  it("copies the code and announces it in a polite status", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CodeBlock code="npm test" label="Test command" />);
    await user.click(screen.getByRole("button", { name: "Copy test command" }));
    expect(writeText).toHaveBeenCalledWith("npm test");
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
  });
  it("tells people to copy by hand when the clipboard fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    render(<CodeBlock code="npm test" />);
    await user.click(screen.getByRole("button", { name: /copy/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Select the text and copy it");
  });
  it("copies with the keyboard", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CodeBlock code="x" />);
    await user.tab(); // pre
    await user.tab(); // Copy
    await user.keyboard("{Enter}");
    expect(writeText).toHaveBeenCalledWith("x");
  });
  it("merges className", () => {
    render(<CodeBlock code="x" className="custom" />);
    expect(screen.getByRole("group")).toHaveClass("kl-code-block", "custom");
  });
});
