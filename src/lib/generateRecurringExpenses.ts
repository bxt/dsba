import type { Expense, RecurringFunding } from "./persistence.svelte";

export function generateRecurringExpenses(
  until: Date,
  recurringFunding: RecurringFunding,
): { expenses: Expense[]; balanceAdjustment: number; newStart: string } {
  const { id, amount, interval, start } = recurringFunding;

  const expenses: Expense[] = [];

  const startDate = new Date(start);
  while (startDate <= until) {
    expenses.push({
      id: crypto.randomUUID(),
      amount,
      date: startDate.toISOString(),
      recurringFundingId: id,
    });

    switch (interval) {
      case "daily":
        startDate.setUTCDate(startDate.getUTCDate() + 1);
        break;
      case "weekly":
        startDate.setUTCDate(startDate.getUTCDate() + 7);
        break;
      case "monthly":
        startDate.setUTCMonth(startDate.getUTCMonth() + 1);
        break;
      case "yearly":
        startDate.setUTCFullYear(startDate.getUTCFullYear() + 1);
        break;
    }
  }

  const balanceAdjustment = expenses.length * amount;
  const newStart = startDate.toISOString();

  return { expenses, balanceAdjustment, newStart };
}
