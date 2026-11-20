import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Awards, Publications } from "./Awards";

describe("Awards and Publications", () => {
  it("renders awards and publications with time elements and kind badges", () => {
    const { container } = render(
      <Awards
        items={[
          {
            title: "Deterministic Rollup Compaction",
            issuer: "Symposium on Industrial Telemetry Systems",
            date: "2025-10",
            kind: "publication",
            href: "https://papers.example.invalid/rollup",
          },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Awards & publications" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Deterministic Rollup Compaction" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Publication")).toBeInTheDocument();
    expect(container.querySelector("time")).toHaveAttribute("dateTime", "2025-10");
  });

  it("renders Publications wrapper with default heading", () => {
    render(
      <Publications items={[{ title: "WAL Compaction Notes", issuer: "Systems Journal", date: "2024" }]} />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Publications" })).toBeInTheDocument();
  });
});
