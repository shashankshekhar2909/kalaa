import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeatureGrid } from "./FeatureGrid";

describe("FeatureGrid", () => {
  it("renders section h2 and feature cards at h3", () => {
    render(
      <FeatureGrid
        heading="Engineered for predictable operations"
        features={[
          {
            title: "Bounded-memory stream compactor",
            description: "Fixed ring buffers.",
            badge: "Storage",
            href: "#storage",
            linkLabel: "Explore storage engine",
          },
        ]}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Engineered for predictable operations" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Bounded-memory stream compactor" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Storage")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore storage engine" })).toHaveAttribute("href", "#storage");
  });
});
