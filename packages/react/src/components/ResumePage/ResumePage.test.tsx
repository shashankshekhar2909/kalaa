import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { readComponentCss } from "../../../scripts/ai-manifest.mjs";
import { ResumePage } from "./ResumePage";
import { sampleResumeData } from "../../schemas/sampleData";

describe("ResumePage", () => {
  it("renders full resume in single-column layout with ordered headings and landmarks", () => {
    const { container } = render(<ResumePage data={sampleResumeData} layout="single-column" />);
    expect(screen.getByRole("heading", { level: 1, name: "Aarav Deshmukh" })).toBeInTheDocument();
    expect(screen.getByRole("main", { name: "Resume experience and projects" })).toBeInTheDocument();
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();

    // Check heading hierarchy: h1 first, followed only by h2 and h3 without skipping
    const headings = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((el) =>
      Number(el.tagName.slice(1)),
    );
    expect(headings[0]).toBe(1);
    for (let i = 1; i < headings.length; i++) {
      expect(headings[i] - headings[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  it("renders sidebar landmark in sidebar layout and supports print preview class", () => {
    const { container } = render(
      <ResumePage data={sampleResumeData} layout="sidebar" paperSize="letter" forcePrintPreview />,
    );
    expect(
      screen.getByRole("complementary", { name: "Education, skills and credentials" }),
    ).toBeInTheDocument();
    expect(container.firstChild).toHaveClass(
      "kl-resume-page--sidebar",
      "kl-resume-page--letter",
      "kl-resume-page--print",
    );
  });

  it("scopes @page print rules to named pages instead of a global @page rule", () => {
    const css = readComponentCss("ResumePage");
    expect(css).not.toMatch(/@page\s*\{/);
    expect(css).toMatch(/@page\s+kl-resume-page\s*\{/);
    expect(css).toMatch(/page:\s*kl-resume-page/);
  });
});
