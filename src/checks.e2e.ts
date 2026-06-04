import { test, expect } from "@playwright/test";

test("recurring expenses", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2024-02-02T10:00:00Z"));
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Budget" })).toBeVisible();
  await page.getByRole("link", { name: "add" }).click();
  await page.getByLabel("Name").fill("Chelai");
  await page.getByLabel("Balance").fill("13.37");

  await page.getByRole("button", { name: "add recurring funding" }).click();
  await page.getByLabel("Budget").fill("1.23");
  await page.getByLabel("Starting at").fill("2024-02-02T11:00");

  await page.getByRole("button", { name: "save" }).click();

  await expect(page.getByText("+13,37 € current balance")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Chelai" })).toBeVisible();

  await page.clock.setFixedTime(new Date("2024-02-02T10:30:00Z"));
  await page.goto("/");
  await expect(page.getByText("+13,37 € current balance")).toBeVisible();

  await page.clock.setFixedTime(new Date("2024-02-02T11:30:00Z"));
  await page.goto("/");
  await expect(page.getByText("+14,60 € current balance")).toBeVisible();

  await page.clock.setFixedTime(new Date("2024-02-05T11:30:00Z"));
  await page.goto("/");
  await expect(page.getByText("+18,29 € current balance")).toBeVisible();
  await expect(page.getByText("♻️")).toHaveCount(4);
});
