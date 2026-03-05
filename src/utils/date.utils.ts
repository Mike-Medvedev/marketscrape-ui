const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const abs = Math.abs(diff);
  const isFuture = diff < 0;

  if (abs < MINUTE) return "just now";

  let value: number;
  let unit: string;

  if (abs < HOUR) {
    value = Math.round(abs / MINUTE);
    unit = "minute";
  } else if (abs < DAY) {
    value = Math.round(abs / HOUR);
    unit = "hour";
  } else {
    value = Math.round(abs / DAY);
    unit = "day";
  }

  const plural = value !== 1 ? "s" : "";

  return isFuture
    ? `in ${value} ${unit}${plural}`
    : `${value} ${unit}${plural} ago`;
}
