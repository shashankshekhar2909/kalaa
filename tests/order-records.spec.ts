import { expect, test } from "@playwright/test";

const story = (state: string) => `/iframe.html?id=examples-order-records--${state}&viewMode=story`;

test("order records supports keyboard sorting, pagination, selection and search", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(story("ready"));

  const results = page.getByRole("table", { name: "Orders", exact: true });
  const total = results.getByRole("button", { name: "Total" });
  await total.focus();
  await page.keyboard.press("Enter");
  await expect(results.getByRole("columnheader", { name: "Total" })).toHaveAttribute(
    "aria-sort",
    "ascending",
  );
  await expect(results.getByRole("rowheader").first()).toHaveText("ORD-1044");

  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Page 2 of 2")).toBeVisible();
  await expect(page.getByRole("button", { name: "Next" })).toBeDisabled();
  await expect(results.getByRole("rowheader")).toHaveCount(2);

  const firstOrder = results.getByRole("checkbox", { name: "Select ORD-1043" });
  await firstOrder.focus();
  await page.keyboard.press("Space");
  await expect(results.getByRole("checkbox", { name: "Select page" })).toHaveAttribute(
    "aria-checked",
    "mixed",
  );
  await results.getByRole("checkbox", { name: "Select page" }).click();
  await page.getByRole("button", { name: "Mark shipped (2)" }).click();
  await expect(page.getByText("Updated 2 orders.")).toBeVisible();
  await expect(results.getByRole("cell", { name: "Shipped", exact: true })).toHaveCount(2);

  const search = page.getByRole("searchbox", { name: "Search orders" });
  await search.fill("not a customer");
  await expect(page.getByRole("heading", { name: "No matching orders" })).toBeVisible();
  await search.fill("Maple");
  await expect(results.getByRole("rowheader")).toHaveText("ORD-1042");

  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test("order records can recover from the failed-load example", async ({ page }) => {
  await page.goto(story("error"));
  await expect(page.getByRole("alert")).toContainText("Couldn’t load orders.");
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByRole("table", { name: "Orders", exact: true })).toBeVisible();
});
