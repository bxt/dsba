import { describe, expect, it } from "vitest";
import { formatRelative } from "./formatRelative";

describe("formatRelative", () => {
  const testFormatter = {
    format: (number: number, unit: "minute" | "hours" | "days") =>
      `${Math.abs(number)}${unit.substring(0, 1)} ${number < 0 ? "ago" : "later"}`,
  };
  const myFormatRelative = formatRelative(testFormatter);
  it("formats into minutes / hours / days", () => {
    const now = new Date(2026, 4, 10, 14, 22, 4);
    expect(myFormatRelative(now, now)).toBe("just now");
    expect(myFormatRelative(now, new Date(2026, 4, 10, 14, 23, 3))).toBe(
      "just now",
    );
    expect(myFormatRelative(now, new Date(2026, 4, 10, 14, 23, 4))).toBe(
      "1m ago",
    );
    expect(myFormatRelative(now, new Date(2026, 4, 10, 14, 23, 34))).toBe(
      "1m ago",
    );
    expect(myFormatRelative(now, new Date(2026, 4, 10, 14, 23, 35))).toBe(
      "2m ago",
    );
    expect(myFormatRelative(now, new Date(2026, 4, 10, 16, 22, 3))).toBe(
      "120m ago",
    );
    expect(myFormatRelative(now, new Date(2026, 4, 10, 16, 22, 4))).toBe(
      "2h ago",
    );
    expect(myFormatRelative(now, new Date(2026, 4, 12, 14, 22, 3))).toBe(
      "48h ago",
    );
    expect(myFormatRelative(now, new Date(2026, 4, 12, 14, 22, 4))).toBe(
      "2d ago",
    );
    expect(myFormatRelative(new Date(2026, 4, 6), new Date(2026, 4, 10))).toBe(
      "4d ago",
    );
  });
  it("can deal with DST", () => {
    expect(
      myFormatRelative(
        new Date(2026, 2, 29, 1, 59, 0),
        new Date(2026, 2, 29, 3, 1, 0),
      ),
    ).toBe("2m ago");
    expect(
      myFormatRelative(
        new Date(2026, 9, 25, 1, 59, 0),
        new Date(2026, 9, 25, 3, 1, 0),
      ),
    ).toBe("2h ago");
  });
});
