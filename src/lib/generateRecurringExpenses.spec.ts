import { describe, expect, it } from "vitest";
import { generateRecurringExpenses } from "./generateRecurringExpenses";

describe("generateRecurringExpenses", () => {
  it("creates daily expenses", () => {
    expect(
      generateRecurringExpenses(new Date("2026-03-31T23:45:56.789Z"), {
        id: "test-id",
        amount: 1337,
        interval: "daily",
        start: "2026-03-28T14:04:25.005Z",
      }),
    ).toMatchObject({
      balanceAdjustment: 5348,
      expenses: [
        {
          amount: 1337,
          date: "2026-03-28T14:04:25.005Z",
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
        {
          amount: 1337,
          date: "2026-03-29T14:04:25.005Z",
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
        {
          amount: 1337,
          date: "2026-03-30T14:04:25.005Z",
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
        {
          amount: 1337,
          date: "2026-03-31T14:04:25.005Z",
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
      ],
      newStart: "2026-04-01T14:04:25.005Z",
    });
  });
  it("creates weekly expenses", () => {
    expect(
      generateRecurringExpenses(new Date("2026-04-06T23:45:56.789Z"), {
        id: "test-id",
        amount: 1337,
        interval: "weekly",
        start: "2026-03-28T11:22:33.456Z",
      }),
    ).toMatchObject({
      balanceAdjustment: 2674,
      expenses: [
        {
          amount: 1337,
          date: "2026-03-28T11:22:33.456Z",
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
        {
          amount: 1337,
          date: "2026-04-04T11:22:33.456Z",
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
      ],
      newStart: "2026-04-11T11:22:33.456Z",
    });
  });
  it("creates monthly expenses", () => {
    expect(
      generateRecurringExpenses(new Date("2026-03-06T23:45:56.789Z"), {
        id: "test-id",
        amount: 42,
        interval: "monthly",
        start: "2026-01-02T11:22:33.456Z",
      }),
    ).toMatchObject({
      balanceAdjustment: 126,
      expenses: [
        {
          amount: 42,
          date: "2026-01-02T11:22:33.456Z",
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
        {
          amount: 42,
          date: "2026-02-02T11:22:33.456Z",
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
        {
          amount: 42,
          date: "2026-03-02T11:22:33.456Z",
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
      ],
      newStart: "2026-04-02T11:22:33.456Z",
    });
  });
  it("creates yearly expenses", () => {
    expect(
      generateRecurringExpenses(new Date("2028-01-05T23:45:56.789Z"), {
        id: "test-id",
        amount: 12,
        interval: "yearly",
        start: "2026-02-06T11:22:33.456Z",
      }),
    ).toMatchObject({
      balanceAdjustment: 24,
      expenses: [
        {
          amount: 12,
          date: "2026-02-06T11:22:33.456Z",
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
        {
          amount: 12,
          date: "2027-02-06T11:22:33.456Z",
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
      ],
      newStart: "2028-02-06T11:22:33.456Z",
    });
  });
  it("creates yearly expenses, switches to 1st of March after leap year", () => {
    expect(
      generateRecurringExpenses(new Date("2026-01-05T23:45:56.789Z"), {
        id: "test-id",
        amount: 12,
        interval: "yearly",
        start: "2024-02-29T11:22:33.456Z",
      }),
    ).toMatchObject({
      balanceAdjustment: 24,
      expenses: [
        {
          amount: 12,
          date: "2024-02-29T11:22:33.456Z",
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
        {
          amount: 12,
          date: "2025-03-01T11:22:33.456Z",
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
      ],
      newStart: "2026-03-01T11:22:33.456Z",
    });
  });
  it("creates a single expense if start is until", () => {
    const until = "2026-06-04T14:04:25.005Z";
    const result = generateRecurringExpenses(new Date(until), {
      id: "test-id",
      amount: 13.37,
      interval: "daily",
      start: until,
    });
    expect(result).toMatchObject({
      balanceAdjustment: 13.37,
      expenses: [
        {
          amount: 13.37,
          date: until,
          id: expect.any(String),
          recurringFundingId: "test-id",
        },
      ],
      newStart: "2026-06-05T14:04:25.005Z",
    });

    const secondResult = generateRecurringExpenses(
      new Date("2026-06-04T14:04:25.005Z"),
      {
        id: "test-id",
        amount: 13.37,
        interval: "daily",
        start: result.newStart,
      },
    );

    expect(secondResult).toMatchObject({
      balanceAdjustment: 0,
      expenses: [],
      newStart: result.newStart,
    });
  });
});
