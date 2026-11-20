import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup } from "./RadioGroup";
describe("RadioGroup", () => {
  const options = [
    { value: "merge", label: "Merge records", description: "Updates matching SKUs" },
    { value: "append", label: "Append only" },
    { value: "replace", label: "Replace catalog", disabled: true },
  ];
  it("selects options with arrow keys and forwards ref and class", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <RadioGroup
        ref={ref}
        aria-label="Import mode"
        options={options}
        defaultValue="merge"
        onValueChange={onValueChange}
        className="custom"
      />,
    );
    const group = screen.getByRole("radiogroup", { name: "Import mode" });
    expect(group).toHaveClass("kl-radio-group", "custom");
    expect(ref.current).toBe(group);
    const first = screen.getByRole("radio", { name: "Merge records" });
    expect(first).toBeChecked();
    expect(first).toHaveAccessibleDescription("Updates matching SKUs");
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Append only" })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("append");
  });
  it("does not select disabled options", async () => {
    const user = userEvent.setup();
    render(<RadioGroup aria-label="Import mode" options={options} defaultValue="merge" />);
    const disabledRadio = screen.getByRole("radio", { name: "Replace catalog" });
    await user.click(disabledRadio);
    expect(disabledRadio).not.toBeChecked();
  });
});
