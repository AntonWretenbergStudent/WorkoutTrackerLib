export function setVolumeKg(set) {
  return set.reps * set.weightKg;
}

export function epley1RM({ weightKg, reps }) {
  if (reps <= 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

export function paceMinPerKm({ distanceKm, durationMin }) {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return 0;
  if (!Number.isFinite(durationMin) || durationMin <= 0) return 0;
  return durationMin / distanceKm;
}

export function speedKmH({ distanceKm, durationMin }) {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return 0;
  if (!Number.isFinite(durationMin) || durationMin <= 0) return 0;
  return (distanceKm / durationMin) * 60;
}

/**
 * Convert { minutes, seconds } into decimal minutes.
 * - normalizes seconds >= 60
 * - clamps negatives
 */
export function durationMinFrom({ minutes, seconds }) {
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    throw new Error("durationMinFrom requires finite { minutes, seconds }");
  }
  const m = Math.max(0, Math.floor(minutes));
  const sRaw = Math.max(0, Math.floor(seconds));
  const extraMin = Math.floor(sRaw / 60);
  const s = sRaw % 60;
  return m + extraMin + s / 60;
}
