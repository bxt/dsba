import { test, expect } from "@playwright/test";

test("add wallet", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Budget" })).toBeVisible();
  await page.getByRole("link", { name: "add" }).click();
  await page.getByLabel("Name").fill("Chelai");
  await page.getByLabel("Balance").fill("13.37");
  await page.getByRole("button", { name: "save" }).click();
  await expect(page.getByTitle("current balance")).toHaveText("13,37 €");
  await expect(page.getByRole("heading", { name: "Chelai" })).toBeVisible();
});
