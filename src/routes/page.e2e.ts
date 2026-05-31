import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/DSBA – damn simple budget app/);
});

test("close onboarding", async ({ page }) => {
  await page.goto("/");

  const onboarding = page.getByText(
    "makes keeping track of your expenses simple",
  );
  await expect(onboarding).toBeVisible();

  await page.getByRole("button", { name: "toggle infobox" }).click();

  await expect(onboarding).not.toBeVisible();

  await page.goto("/");

  await expect(onboarding).not.toBeVisible();

  await page.getByRole("button", { name: "toggle infobox" }).click();

  await expect(onboarding).toBeVisible();
});

test("add expenses", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTitle("current balance")).toHaveText("0,00 €");
  await page.getByLabel("Amount").fill("4.56");
  await page.getByRole("button", { name: "Subtract" }).click();
  await expect(page.getByTitle("current balance")).toHaveText("-4,56 €");
  await page.getByLabel("Amount").fill("13.36");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByTitle("current balance")).toHaveText("8,80 €");

  await page.goto("/");
  await expect(page.getByTitle("current balance")).toHaveText("8,80 €");
});
