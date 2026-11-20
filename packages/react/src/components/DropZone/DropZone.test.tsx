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
    const huge = new File(["x".repeat(2048)], "huge.csv", { type: "text/csv" });
    fireEvent.drop(ref.current!, { dataTransfer: { files: [huge] } });
    expect(onReject).toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(/exceeds the 1 KB size limit/);
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
});
