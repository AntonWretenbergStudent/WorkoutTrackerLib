
/**
 * Calculate total strength volume for a set.
 * @param {{reps:number, weightKg:number}} set
 * @returns {number} reps * weightKg
 */
export function setVolumeKg(set) {
  return set.reps * set.weightKg;
}

/**
 * Estimate one-rep max using the Epley formula.
 * @param {{weightKg:number, reps:number}} param0
 * @returns {number} estimated 1RM (kg)
 */
export function epley1RM({ weightKg, reps }) {
  if (reps <= 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

/**
 * Compute pace in minutes per kilometer.
 * @param {{distanceKm:number, durationMin:number}} param0
 * @returns {number} minutes per km (0 if invalid input)
 */
export function paceMinPerKm({ distanceKm, durationMin }) {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return 0;
  if (!Number.isFinite(durationMin) || durationMin <= 0) return 0;
  return durationMin / distanceKm;
}

/**
 * Compute speed in km/h.
 * @param {{distanceKm:number, durationMin:number}} param0
 * @returns {number} km/h (0 if invalid input)
 */
export function speedKmH({ distanceKm, durationMin }) {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return 0;
  if (!Number.isFinite(durationMin) || durationMin <= 0) return 0;
  return (distanceKm / durationMin) * 60;
}

/**
 * Convert `{ minutes, seconds }` into decimal minutes.
 * - Normalizes seconds >= 60.
 * - Clamps negative values to zero.
 * @param {{minutes:number, seconds:number}} param0
 * @returns {number} total minutes as a decimal
 * @throws {Error} if minutes or seconds are not finite numbers.
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
