import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProfileCard } from "./ProfileCard";

describe("ProfileCard", () => {
  it("renders name, role, bio, stats, skills and actions", () => {
    render(
      <ProfileCard
        name="Aarav Deshmukh"
        role="Principal Systems Architect"
        location="Pune, India"
        bio="Designing deterministic telemetry systems."
        availability="Available for Q1 reviews"
        stats={[{ label: "Events ingested", value: "1.4M/s" }]}
        skills={["Rust", "React 19"]}
        primaryAction={{ label: "Book review", href: "#contact" }}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Aarav Deshmukh" })).toBeInTheDocument();
    expect(screen.getByText("Available for Q1 reviews")).toBeInTheDocument();
    expect(screen.getByText("1.4M/s")).toBeInTheDocument();
    expect(screen.getByText("Rust")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Book review" })).toHaveAttribute("href", "#contact");
  });
});
