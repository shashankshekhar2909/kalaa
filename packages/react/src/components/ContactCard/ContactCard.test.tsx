import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactCard } from "./ContactCard";

describe("ContactCard", () => {
  it("renders contact details and primary email action", () => {
    render(
      <ContactCard
        title="Start a technical conversation"
        email="aarav.deshmukh@example.invalid"
        location="Pune, India"
        availability="2 advisory days per month"
        ctaLabel="Email Aarav"
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Start a technical conversation" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Pune, India")).toBeInTheDocument();
    expect(screen.getByText("2 advisory days per month")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email Aarav" })).toHaveAttribute(
      "href",
      "mailto:aarav.deshmukh@example.invalid",
    );
  });
});
