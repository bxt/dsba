import { test, expect } from "@playwright/test";

test("edit name", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Budget" })).toBeVisible();
  await page.getByRole("link", { name: "edit" }).click();
  await page.getByLabel("Name").fill("Chelai");
  await page.getByLabel("Name").press("Enter");
  await expect(page.getByTitle("current balance")).toHaveText("0,00 €");
  await expect(page.getByRole("heading", { name: "Chelai" })).toBeVisible();
});

test("edit balance", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Budget" })).toBeVisible();
  await page.getByRole("link", { name: "edit" }).click();
  await page.getByLabel("Balance").fill("13.37");
  await page.getByLabel("Balance").press("Enter");
  await expect(page.getByTitle("current balance")).toHaveText("13,37 €");
  await expect(page.getByRole("heading", { name: "Budget" })).toBeVisible();
});
