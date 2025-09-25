
/**
 * Check if a date falls within the week starting at `isoWeekStart`.
 * The checked week is [weekStart, weekStart + 7 days).
 * @param {string} isoDate - ISO date (YYYY-MM-DD).
 * @param {string} isoWeekStart - Monday of the week (YYYY-MM-DD).
 * @returns {boolean}
 */
export function isWithinWeek(isoDate, isoWeekStart) {
  const date = new Date(isoDate);
  const weekStart = new Date(isoWeekStart);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  return date >= weekStart && date < weekEnd;
}

/**
 * Format decimal minutes into "m:ss" or "h:mm:ss".
 * @param {number} totalMin - decimal minutes.
 * @returns {string} formatted time string.
 */
export function fmtMinutes(totalMin) {
  const safe = Math.max(0, Number(totalMin) || 0);

  let totalSeconds = Math.round(safe * 60);
  const h = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Format a pace value (minutes per km) as "m:ss/km".
 * @param {number} minPerKm - decimal minutes per km.
 * @returns {string} formatted pace string.
 */
export function fmtPace(minPerKm) {
  const totalSeconds = Math.round(Math.max(0, Number(minPerKm) || 0) * 60);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}/km`;
}
