import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ValueComparison } from "./ValueComparison";

it("presents labels and values in reading order", () => {
  render(
    <ValueComparison
      originalLabel="Draft claim"
      proposedLabel="Suggested revision"
      original="Draft text"
      proposed={<strong>Revised text</strong>}
    />,
  );

  expect(screen.getAllByRole("term").map((term) => term.textContent)).toEqual([
    "Draft claim",
    "Suggested revision",
  ]);
  expect(screen.getAllByRole("definition").map((value) => value.textContent)).toEqual([
    "Draft text",
    "Revised text",
  ]);
});

it("distinguishes an empty value from zero", () => {
  render(<ValueComparison original="" proposed={0} emptyLabel="Missing from source" />);

  expect(screen.getByText("Missing from source")).toBeInTheDocument();
  expect(screen.getByText("0")).toBeInTheDocument();
});
