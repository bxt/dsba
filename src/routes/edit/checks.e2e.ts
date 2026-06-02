import { test, expect } from "@playwright/test";

test("edit name", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Budget" })).toBeVisible();
  await page.getByRole("link", { name: "edit" }).click();
  await page.getByLabel("Name").fill("Chelai");
  await page.getByLabel("Name").press("Enter");
  await expect(page.getByText("0,00 € current balance")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Chelai" })).toBeVisible();
});

test("edit balance", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Budget" })).toBeVisible();
  await page.getByRole("link", { name: "edit" }).click();
  await page.getByLabel("Balance").fill("13.37");
  await page.getByLabel("Balance").press("Enter");
  await expect(page.getByText("+13,37 € current balance")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Budget" })).toBeVisible();
});

test("delete wallet", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Budget" })).toBeVisible();
  await page.getByRole("link", { name: "add" }).click();
  await page.getByLabel("Name").fill("Chelai");
  await page.getByLabel("Balance").fill("13.37");
  await page.getByRole("button", { name: "save" }).click();
  await expect(page.getByText("+13,37 € current balance")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Chelai" })).toBeVisible();

  await page.getByRole("link", { name: "edit" }).click();
  await page.getByRole("button", { name: "delete" }).click();

  await expect(page.getByRole("heading", { name: "Budget" })).toBeVisible();

  // last can not be deleted
  await page.getByRole("link", { name: "edit" }).click();
  await expect(page.getByRole("button", { name: "delete" })).toHaveCount(0);
});
