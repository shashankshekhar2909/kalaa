import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";
describe("Avatar", () => {
  it("derives initials from name and exposes an accessible img role", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} name="Asha Rao" size="lg" shape="square" className="custom" />);
    const avatar = screen.getByRole("img", { name: "Asha Rao" });
    expect(avatar).toHaveTextContent("AR");
    expect(avatar).toHaveClass("kl-avatar", "kl-avatar--lg", "kl-avatar--square", "custom");
    expect(ref.current).toBe(avatar);
  });
  it("falls back to initials when the image fails to load", () => {
    render(<Avatar name="Asha Rao" src="https://example.invalid/avatar.png" />);
    const img = screen.getByRole("img", { name: "Asha Rao" });
    expect(img.tagName).toBe("IMG");
    fireEvent.error(img);
    expect(screen.getByRole("img", { name: "Asha Rao" })).toHaveTextContent("AR");
  });
});
