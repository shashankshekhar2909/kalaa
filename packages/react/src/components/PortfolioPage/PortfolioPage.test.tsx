import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PortfolioPage } from "./PortfolioPage";
import { samplePortfolioData } from "../../schemas/sampleData";

describe("PortfolioPage", () => {
  it("renders landmarks, ordered headings and portfolio sections from PortfolioData", () => {
    const { container } = render(<PortfolioPage data={samplePortfolioData} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primary portfolio navigation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Aarav Deshmukh" })).toBeInTheDocument();

    const headings = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((el) =>
      Number(el.tagName.slice(1)),
    );
    expect(headings[0]).toBe(1);
    for (let i = 1; i < headings.length; i++) {
      expect(headings[i] - headings[i - 1]).toBeLessThanOrEqual(1);
    }
  });
});
