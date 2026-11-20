import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DropZone } from "./DropZone";
describe("DropZone", () => {
  it("shows accept and size-limit message, accepts valid dropped files and rejects oversized ones", () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <DropZone
        ref={ref}
        label="Drop CSV file"
        accept=".csv,text/csv"
        maxSizeBytes={1024}
        onFiles={onFiles}
        onReject={onReject}
        className="custom"
      />,
    );
    expect(ref.current).toHaveClass("kl-drop-zone", "custom");
    expect(screen.getByText(/Maximum size: 1 KB/)).toBeInTheDocument();
    const valid = new File(["sku,name\n1,Tea"], "products.csv", { type: "text/csv" });
    fireEvent.drop(ref.current!, { dataTransfer: { files: [valid] } });
    expect(onFiles).toHaveBeenCalledWith([valid]);
    expect(screen.getByText("Selected: products.csv")).toBeInTheDocument();

    const huge = new File(["x".repeat(2048)], "huge.csv", { type: "text/csv" });
    fireEvent.drop(ref.current!, { dataTransfer: { files: [huge] } });
    expect(onReject).toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(/exceeds the 1 KB size limit/);
    // Stale success display is cleared when a subsequent drop fails
    expect(screen.queryByText(/Selected: products\.csv/)).toBeNull();
  });

  it("rejects files that do not match accept", () => {
    const onReject = vi.fn();
    const { container } = render(<DropZone accept=".csv" onReject={onReject} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const bad = new File(["hello"], "notes.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [bad] } });
    expect(onReject).toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(/does not match accepted formats/);
  });

  it("explicitly rejects extra files when multiple is false", () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <DropZone ref={ref} accept=".csv,text/csv" multiple={false} onFiles={onFiles} onReject={onReject} />,
    );
    const first = new File(["a"], "first.csv", { type: "text/csv" });
    const second = new File(["b"], "second.csv", { type: "text/csv" });
    const third = new File(["c"], "third.csv", { type: "text/csv" });

    fireEvent.drop(ref.current!, { dataTransfer: { files: [first, second, third] } });
    expect(onFiles).toHaveBeenCalledWith([first]);
    expect(onReject).toHaveBeenCalledTimes(2);
    expect(onReject).toHaveBeenNthCalledWith(
      1,
      "Only a single file can be selected; second.csv was rejected.",
      second,
    );
    expect(onReject).toHaveBeenNthCalledWith(
      2,
      "Only a single file can be selected; third.csv was rejected.",
      third,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Only a single file can be selected; second.csv was rejected.",
    );
  });
});
