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
