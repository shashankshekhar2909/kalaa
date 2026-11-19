import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KeyValue } from "./KeyValue";
describe("KeyValue", () => {
  it("renders its content", () => {
    render(<KeyValue items={[{ label: "Status", value: "" }]} />);
    expect(screen.getByRole("term")).toBeInTheDocument();
  });
});
