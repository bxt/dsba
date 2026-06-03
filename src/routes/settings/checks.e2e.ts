import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("exports data", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Amount").fill("4.56");
  await page.getByRole("button", { name: "Subtract" }).click();
  await page.getByLabel("Amount").fill("13.37");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByLabel("Amount").fill("9.11");
  await page.getByRole("button", { name: "Subtract" }).click();

  await page.goto("/settings");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "export JSON" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(
    /dsba-data-\d{4}-\d{2}-\d{2}T\d{2}_\d{2}_\d{2}\.\d{3}Z.json/,
  );
  const filePath = await download.path();
  const contents = await readFile(filePath, { encoding: "utf8" });
  const object = JSON.parse(contents);
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  expect(object).toMatchObject({
    activeWallet: expect.any(String),
    onboardingCompleted: false,
    version: 2,
    wallets: [
      {
        balance: -30,
        expenses: [
          {
            amount: -456,
            date: expect.stringMatching(dateRegex),
            id: expect.any(String),
          },
          {
            amount: 1337,
            date: expect.stringMatching(dateRegex),
            id: expect.any(String),
          },
          {
            amount: -911,
            date: expect.stringMatching(dateRegex),
            id: expect.any(String),
          },
        ],
        id: expect.any(String),
        name: "Budget",
      },
    ],
  });

  expect(object.activeWallet).toEqual(object.wallets[0].id);
});
