import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";
describe("Card", () => {
  it("renders its content", () => {
    render(<Card title="Products">Catalog</Card>);
    expect(screen.getByRole("heading", { name: "Products" })).toBeInTheDocument();
  });
  it("renders the title at the requested heading level", () => {
    render(
      <Card title="Neel" titleLevel={3}>
        x
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Neel" })).toBeInTheDocument();
  });
});
