import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LinkList } from "./LinkList";

describe("LinkList", () => {
  it("renders heading, links, descriptions and meta badges", () => {
    render(
      <LinkList
        heading="Selected writing"
        items={[
          {
            label: "Rollup compaction paper",
            href: "https://papers.example.invalid/rollup",
            description: "SITS 2025",
            meta: "Paper",
          },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Selected writing" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Rollup compaction paper" })).toHaveAttribute(
      "href",
      "https://papers.example.invalid/rollup",
    );
    expect(screen.getByText("SITS 2025")).toBeInTheDocument();
    expect(screen.getByText("Paper")).toBeInTheDocument();
  });
});
