import { page, userEvent } from "vitest/browser";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import NumberInputHarness from "./NumberInputHarness.svelte";

describe("NumberInput.svelte", () => {
  it("correctly synchronizes values", async () => {
    render(NumberInputHarness);

    const a = page.getByLabelText("a");
    const b = page.getByLabelText("b");

    await expect.element(a).toHaveValue("1");
    await expect.element(b).toHaveValue("1");

    await page.getByLabelText("a").fill("1,45");
    await expect.element(b).toHaveValue("1.45");
    await expect.element(a).toHaveValue("1,45");

    await a.fill(",3a");
    await expect.element(b).toHaveValue("0.30");
    await expect.element(a).toHaveValue(",3");

    await userEvent.type(a, "{selectall}{backspace}");
    await expect.element(b).toHaveValue("");
    await expect.element(a).toHaveValue("");

    await userEvent.type(a, ",");
    await expect.element(b).toHaveValue("");
    await expect.element(a).toHaveValue(",");

    await userEvent.type(a, ".");
    await expect.element(b).toHaveValue("");
    await expect.element(a).toHaveValue(".");

    await userEvent.type(a, ",");
    await expect.element(b).toHaveValue("");
    await expect.element(a).toHaveValue(",");

    await userEvent.type(a, "638");
    await expect.element(b).toHaveValue("0.64");
    await expect.element(a).toHaveValue(",638");

    await userEvent.type(a, "-");
    await expect.element(b).toHaveValue("-0.64");
    await expect.element(a).toHaveValue("-,638");

    await userEvent.type(a, "-");
    await expect.element(b).toHaveValue("0.64");
    await expect.element(a).toHaveValue(",638");

    await userEvent.type(a, "[ArrowLeft][ArrowLeft],");
    await expect.element(b).toHaveValue("6.38");
    await expect.element(a).toHaveValue("6,38");

    await userEvent.type(a, "2-");
    await expect.element(b).toHaveValue("-6.24");
    await expect.element(a).toHaveValue("-6,238");

    await userEvent.type(a, "+1");
    await expect.element(b).toHaveValue("6.21");
    await expect.element(a).toHaveValue("6,2138");

    await userEvent.type(a, ".");
    await expect.element(b).toHaveValue("621.38");
    await expect.element(a).toHaveValue("621.38");

    await userEvent.type(a, "[ArrowLeft][ArrowLeft],");
    await expect.element(b).toHaveValue("62.14");
    await expect.element(a).toHaveValue("62,138");

    await userEvent.type(a, "[ArrowRight][ArrowRight],");
    await expect.element(b).toHaveValue("6213.80");
    await expect.element(a).toHaveValue("6213,8");

    await userEvent.type(b, "[End]1");
    await expect.element(a).toHaveValue("6213,8");
    await expect.element(b).toHaveValue("6213.801");

    await userEvent.type(b, ",");
    await expect.element(a).toHaveValue("6213801");
    await expect.element(b).toHaveValue("6213801,");
  });
});
