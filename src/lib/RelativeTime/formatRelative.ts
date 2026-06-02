export const formatRelative =
  (formatter: {
    format: (number: number, unit: "minute" | "hours" | "days") => string;
  }) =>
  (date: Date, now: Date): string => {
    const minutesAgo = (date.getTime() - now.getTime()) / 1000 / 60;
    if (Math.abs(minutesAgo) < 1) return "just now";
    const hoursAgo = minutesAgo / 60;
    if (Math.abs(hoursAgo) < 2)
      return formatter.format(Math.round(minutesAgo), "minute");
    const daysAgo = hoursAgo / 24;
    if (Math.abs(daysAgo) < 2)
      return formatter.format(Math.round(hoursAgo), "hours");
    return formatter.format(Math.round(daysAgo), "days");
  };
