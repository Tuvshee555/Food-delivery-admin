export function calcTrend(
  current: number,
  previous: number
): { value: number; direction: "up" | "down" | "flat" } {
  if (previous === 0 && current === 0) {
    return { value: 0, direction: "flat" };
  }

  if (previous === 0) {
    return { value: 100, direction: "up" };
  }

  const diff = ((current - previous) / previous) * 100;

  return {
    value: Math.abs(Math.round(diff)),
    direction: diff > 0 ? "up" : diff < 0 ? "down" : "flat",
  };
}
