import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders h1 headline, eyebrow badge, actions and highlights", () => {
    render(
      <Hero
        eyebrow="Release 2.4"
        title="Calm telemetry for high-voltage operations"
        description="Ingest millions of events."
        primaryAction={{ label: "Deploy cluster", href: "#deploy" }}
        secondaryAction={{ label: "Read paper", href: "#paper" }}
        highlights={["Deterministic 18 ms p99 ingest"]}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Calm telemetry for high-voltage operations" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Release 2.4")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Deploy cluster" })).toHaveAttribute("href", "#deploy");
    expect(screen.getByText("Deterministic 18 ms p99 ingest")).toBeInTheDocument();
  });
});
