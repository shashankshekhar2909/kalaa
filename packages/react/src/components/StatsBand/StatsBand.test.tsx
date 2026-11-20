import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatsBand } from "./StatsBand";

describe("StatsBand", () => {
  it("renders heading and tabular stats inside a definition list", () => {
    render(
      <StatsBand
        heading="Benchmarks"
        stats={[{ label: "Ingest throughput", value: "1.4M/s", detail: "Per 4-core node" }]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Benchmarks" })).toBeInTheDocument();
    expect(screen.getByText("Ingest throughput")).toBeInTheDocument();
    expect(screen.getByText("1.4M/s")).toBeInTheDocument();
    expect(screen.getByText("Per 4-core node")).toBeInTheDocument();
  });
});
