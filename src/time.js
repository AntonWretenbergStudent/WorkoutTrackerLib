// src/time.js
export function isWithinWeek(isoDate, isoWeekStart) {
  const date = new Date(isoDate);
  const weekStart = new Date(isoWeekStart);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7); // [start, start+7)
  return date >= weekStart && date < weekEnd;
}

export function fmtPace(minPerKm) {
  const minutes = Math.floor(minPerKm);
  const seconds = Math.round((minPerKm - minutes) * 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}/km`;
}

export function fmtMinutes(totalMin) {
  const h = Math.floor(totalMin / 60);
  const m = Math.floor(totalMin % 60);
  const s = Math.round((totalMin - Math.floor(totalMin)) * 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}
