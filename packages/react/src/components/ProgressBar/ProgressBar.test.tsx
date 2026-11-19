import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressBar } from "./ProgressBar";
describe("ProgressBar", () => {
  it("exposes its label and value", () => {
    render(<ProgressBar label="Import progress" value={25} max={50} hideLabel />);
    expect(screen.getByRole("progressbar", { name: "Import progress" })).toHaveAttribute(
      "aria-valuenow",
      "25",
    );
  });
});

describe("ProgressBar details", () => {
  it("shows the visible label and clamps range attributes", () => {
    render(<ProgressBar label="Upload" value={30} />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuenow", "30");
    expect(screen.getByText("Upload")).toBeVisible();
  });
});
