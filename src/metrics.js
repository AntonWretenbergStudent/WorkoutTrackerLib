export function setVolumeKg(set) {
  return set.reps * set.weightKg;
}

export function epley1RM({ weightKg, reps }) {
  if (reps <= 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

export function paceMinPerKm({ distanceKm, durationMin }) {
  return durationMin / distanceKm;
}

export function speedKmH({ distanceKm, durationMin }) {
  return (distanceKm / durationMin) * 60;
}
