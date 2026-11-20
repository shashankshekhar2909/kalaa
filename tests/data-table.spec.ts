import { expect, test } from "@playwright/test";

test("sorts and creates, edits, and deletes records inline", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/iframe.html?id=components-datatable--inline-crud&viewMode=story");
  const table = page.getByRole("table", { name: "Contacts" });

  await table.getByRole("button", { name: "Name" }).press("Enter");
  await expect(table.getByRole("columnheader", { name: "Name" })).toHaveAttribute("aria-sort", "ascending");
  await expect(table.getByRole("row").nth(1)).toContainText("Arun Rao");
  await table.getByRole("button", { name: "Name" }).press("Enter");
  await expect(table.getByRole("row").nth(1)).toContainText("Mina Sen");

  await page.getByRole("button", { name: "Add record" }).click();
  await expect(table.getByRole("textbox", { name: "Name" })).toBeFocused();
  await table.getByRole("textbox", { name: "Name" }).fill("Lee Park");
  await table.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("alert")).toContainText("Enter a name and a valid email address.");
  await expect(table.getByRole("textbox", { name: "Name" })).toHaveValue("Lee Park");
  await table.getByRole("textbox", { name: "Email" }).fill("lee@example.com");
  await table.getByRole("button", { name: "Save" }).click();
  await expect(table.getByRole("cell", { name: "Lee Park", exact: true })).toBeVisible();

  await table.getByRole("button", { name: "Edit Lee Park" }).click();
  await table.getByRole("textbox", { name: "Name" }).fill("Lee Chen");
  await table.getByRole("button", { name: "Save" }).click();
  await expect(table.getByRole("cell", { name: "Lee Chen", exact: true })).toBeVisible();

  await table.getByRole("button", { name: "Delete Lee Chen" }).click();
  await table.getByRole("button", { name: "Cancel" }).click();
  await expect(table.getByRole("cell", { name: "Lee Chen", exact: true })).toBeVisible();
  await table.getByRole("button", { name: "Delete Lee Chen" }).click();
  await table.getByRole("button", { name: "Confirm delete Lee Chen" }).click();
  await expect(table.getByRole("cell", { name: "Lee Chen", exact: true })).toHaveCount(0);
});
