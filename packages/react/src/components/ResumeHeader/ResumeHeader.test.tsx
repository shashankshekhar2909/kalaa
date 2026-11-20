import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResumeHeader } from "./ResumeHeader";

describe("ResumeHeader", () => {
  it("renders candidate name as h1, title and contact links", () => {
    render(
      <ResumeHeader
        name="Aarav Deshmukh"
        title="Principal Systems Architect"
        location="Pune, India"
        email="aarav.deshmukh@example.invalid"
        phone="+91 20 5550 0194"
        website="https://aarav-systems.example.invalid"
        links={[{ label: "GitHub", href: "https://github.example.invalid/aarav" }]}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Aarav Deshmukh" })).toBeInTheDocument();
    expect(screen.getByText("Principal Systems Architect")).toBeInTheDocument();
    expect(screen.getByText("Pune, India")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "aarav.deshmukh@example.invalid" })).toHaveAttribute(
      "href",
      "mailto:aarav.deshmukh@example.invalid",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.example.invalid/aarav",
    );
  });

  it("forwards className and ref to header element", () => {
    let node: HTMLElement | null = null;
    render(
      <ResumeHeader
        ref={(el) => {
          node = el;
        }}
        className="kl-custom"
        name="Aarav Deshmukh"
        title="Architect"
      />,
    );
    expect(node).toHaveClass("kl-resume-header", "kl-custom");
  });
});
