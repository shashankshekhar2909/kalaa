import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";
it("navigates tabs with arrow keys", async () => {
  render(
    <Tabs
      items={[
        { value: "products", label: "Products", content: "Catalog" },
        { value: "imports", label: "Imports", content: "History" },
      ]}
    />,
  );
  await userEvent.tab();
  await userEvent.keyboard("{ArrowRight}{Enter}");
  expect(screen.getByRole("tab", { name: "Imports" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("History");
});
