import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
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

it("forwards class and ref and prevents selecting disabled tabs", async () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <Tabs
      aria-label="Catalog views"
      ref={ref}
      className="custom"
      items={[
        { value: "products", label: "Products", content: "Catalog" },
        { value: "exports", label: "Exports", content: "Exports", disabled: true },
        { value: "imports", label: "Imports", content: "History" },
      ]}
    />,
  );
  expect(ref.current).toHaveClass("custom");
  expect(screen.getByRole("tab", { name: "Exports" })).toHaveAttribute("aria-disabled", "true");
  await userEvent.tab();
  await userEvent.keyboard("{ArrowRight}");
  await userEvent.keyboard("{Enter}");
  expect(screen.getByRole("tab", { name: "Exports" })).toHaveAttribute("aria-selected", "false");
  await userEvent.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: "Imports" })).toHaveFocus();
});

it("shows only the selected panel and selects on click", async () => {
  render(
    <Tabs
      aria-label="Views"
      items={[
        { value: "a", label: "Alpha", content: "First" },
        { value: "b", label: "Beta", content: "Second" },
      ]}
    />,
  );
  expect(screen.getByRole("tabpanel")).toHaveTextContent("First");
  await userEvent.click(screen.getByRole("tab", { name: "Beta" }));
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Second");
});
