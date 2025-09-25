import { Workout, Exercise, StrengthSet, EnduranceSet } from "./models.js";
import {
  setVolumeKg,
  epley1RM,
  paceMinPerKm,
  speedKmH,
  durationMinFrom,
} from "./metrics.js";
import { isWithinWeek, fmtMinutes, fmtPace } from "./time.js";

/**
 * Small helper to round numbers.
 * @param {number} x - The number to round.
 * @param {number} [decimals=0] - Number of decimals to keep.
 * @returns {number} Rounded number.
 */
function round(x, decimals = 0) {
  const f = 10 ** decimals;
  return Math.round((Number(x) || 0) * f) / f;
}

export class WorkoutTracker {
  #workouts = new Map(); // id -> Workout

  /**
   * Add a new workout.
   * @param {{id: string, date: string, type: string}} param0
   * @throws {Error} If workout id already exists.
   */
  addWorkout({ id, date, type }) {
    if (this.#workouts.has(id)) throw new Error("Duplicate workout id");
    if (!id || typeof id !== "string") throw new Error("Workout id must be a string");
    if (!date || typeof date !== "string") throw new Error("Workout date must be an ISO string");
    if (!type || typeof type !== "string") throw new Error("Workout type must be a string");

    this.#workouts.set(id, new Workout({ id, date, type }));
  }

  /**
   * Add an exercise to an existing workout.
   * @param {string} workoutId
   * @param {string} name - Name of the exercise
   */
  addExercise(workoutId, name) {
    if (!name || !name.trim()) throw new Error("Exercise name is required");
    const workout = this.#getWorkout(workoutId);
    const cleanName = name.trim();
    if (!workout.exercises.some((e) => e.name === cleanName)) {
      workout.exercises.push(new Exercise(cleanName));
    }
  }

  /**
   * Add a strength set to an exercise.
   * @param {string} workoutId
   * @param {string} exerciseName
   * @param {{reps:number, weightKg:number}} param2
   */
  addStrengthSet(workoutId, exerciseName, { reps, weightKg }) {
    if (!Number.isFinite(reps) || reps <= 0) throw new Error("Reps must be > 0");
    if (!Number.isFinite(weightKg) || weightKg <= 0) throw new Error("Weight must be > 0");

    const exercise = this.#getOrCreateExercise(workoutId, exerciseName);
    exercise.sets.push(new StrengthSet({ reps, weightKg }));
  }

  /**
   * Add an endurance set to an exercise.
   * @param {string} workoutId
   * @param {string} exerciseName
   * @param {{distanceKm:number, minutes:number, seconds:number}} param2
   */
  addEnduranceSet(workoutId, exerciseName, { distanceKm, minutes, seconds }) {
    if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
      throw new Error("Distance must be > 0");
    }

    const exercise = this.#getOrCreateExercise(workoutId, exerciseName);
    const durationMin = durationMinFrom({ minutes, seconds });
    exercise.sets.push(new EnduranceSet({ distanceKm, durationMin }));
  }

  // --- Internal helpers (private) ---

  #buildEnduranceNumeric({ distanceKm, durationMin }) {
    if (distanceKm <= 0 || durationMin <= 0) return null;

    const pace = paceMinPerKm({ distanceKm, durationMin });
    const speed = speedKmH({ distanceKm, durationMin });

    return {
      distanceKm: round(distanceKm, 2),
      durationMin: round(durationMin, 1),
      paceMinPerKm: pace,
      speedKmH: round(speed, 2),
    };
  }

  #formatEndurance(endurance) {
    if (!endurance) return null;
    return {
      distance: `${endurance.distanceKm.toFixed(2)} km`,
      duration: fmtMinutes(endurance.durationMin),
      pace: fmtPace(endurance.paceMinPerKm),
      speed: `${endurance.speedKmH.toFixed(2)} km/h`,
    };
  }

  // --- Public queries ---

  /**
   * Get stats for one workout (strength volume, endurance totals, details).
   * @param {string} workoutId
   * @returns {object}
   */
  workoutStats(workoutId) {
    const workout = this.#getWorkout(workoutId);

    let totalStrengthVolumeKg = 0;
    let totalEnduranceDistanceKm = 0;
    let totalEnduranceDurationMin = 0;
    const details = [];

    for (const exercise of workout.exercises) {
      let volumeKg = 0;
      let best1RM = 0;

      for (const set of exercise.sets) {
        if (set.kind === "strength") {
          volumeKg += setVolumeKg(set);
          best1RM = Math.max(best1RM, epley1RM(set));
        } else if (set.kind === "endurance") {
          totalEnduranceDistanceKm += set.distanceKm;
          totalEnduranceDurationMin += set.durationMin;
        }
      }

      if (volumeKg > 0) {
        totalStrengthVolumeKg += volumeKg;
        details.push({
          exercise: exercise.name,
          volumeKg,
          best1RM: round(best1RM, 1),
        });
      }
    }

    const enduranceNumeric = this.#buildEnduranceNumeric({
      distanceKm: totalEnduranceDistanceKm,
      durationMin: totalEnduranceDurationMin,
    });

    return {
      id: workout.id,
      date: workout.date,
      type: workout.type,
      strengthVolumeKg: totalStrengthVolumeKg,
      endurance: enduranceNumeric,
      enduranceFmt: this.#formatEndurance(enduranceNumeric),
      details,
    };
  }

  /**
   * Get summary stats for one week.
   * @param {string} isoWeekStart - Monday of the week (YYYY-MM-DD)
   * @returns {object}
   */
  weeklySummary(isoWeekStart) {
    let totalStrengthVolumeKg = 0;
    let totalDistanceKm = 0;
    let totalDurationMin = 0;
    const workoutIds = [];

    for (const workout of this.#workouts.values()) {
      if (!isWithinWeek(workout.date, isoWeekStart)) continue;

      workoutIds.push(workout.id);
      const stats = this.workoutStats(workout.id);
      totalStrengthVolumeKg += stats.strengthVolumeKg;

      if (stats.endurance) {
        totalDistanceKm += stats.endurance.distanceKm;
        totalDurationMin += stats.endurance.durationMin;
      }
    }

    const enduranceNumeric = this.#buildEnduranceNumeric({
      distanceKm: totalDistanceKm,
      durationMin: totalDurationMin,
    });

    return {
      weekStart: isoWeekStart,
      workouts: workoutIds,
      strengthVolumeKg: totalStrengthVolumeKg,
      endurance: enduranceNumeric,
      enduranceFmt: this.#formatEndurance(enduranceNumeric),
    };
  }

  /**
   * Get best estimated 1RM per exercise across all workouts.
   * @returns {Array<{exercise:string, oneRM:number}>}
   */
  personalRecords() {
    const best = new Map();

    for (const workout of this.#workouts.values()) {
      for (const exercise of workout.exercises) {
        for (const set of exercise.sets) {
          if (set.kind !== "strength") continue;
          const est = epley1RM(set);
          if (est > (best.get(exercise.name) ?? 0)) {
            best.set(exercise.name, est);
          }
        }
      }
    }

    return [...best.entries()]
      .map(([exercise, oneRM]) => ({ exercise, oneRM: round(oneRM, 1) }))
      .sort((a, b) => a.exercise.localeCompare(b.exercise));
  }

  /**
   * Count consecutive workout days ending at given date.
   * @param {string} untilDateIso - ISO date (YYYY-MM-DD)
   * @returns {number}
   */
  streak(untilDateIso) {
    const workoutDates = new Set([...this.#workouts.values()].map((w) => w.date));
    let cursor = new Date(untilDateIso);
    let count = 0;

    while (workoutDates.has(cursor.toISOString().slice(0, 10))) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

  /**
   * Render a text summary of a workout.
   * @param {string} workoutId
   * @returns {string}
   */
  displayWorkout(workoutId) {
    const workout = this.#getWorkout(workoutId);
    const lines = [`Workout ${workout.id} (${workout.date}) [${workout.type}]`];

    for (const exercise of workout.exercises) {
      lines.push(`  ${exercise.name}:`);
      for (const [i, set] of exercise.sets.entries()) {
        if (set.kind === "strength") {
          lines.push(`    Set ${i + 1}: ${set.reps} reps × ${set.weightKg} kg`);
        } else {
          const niceTime = fmtMinutes(set.durationMin);
          const pace = fmtPace(
            paceMinPerKm({ distanceKm: set.distanceKm, durationMin: set.durationMin })
          );
          lines.push(`    ${set.distanceKm} km in ${niceTime} (${pace})`);
        }
      }
    }
    return lines.join("\n");
  }

  // --- Private helpers ---

  #getWorkout(id) {
    const workout = this.#workouts.get(id);
    if (!workout) throw new Error("Workout not found");
    return workout;
  }

  #getOrCreateExercise(workoutId, name) {
    if (!name || !name.trim()) throw new Error("Exercise name is required");
    const workout = this.#getWorkout(workoutId);
    let exercise = workout.exercises.find((e) => e.name === name.trim());
    if (!exercise) {
      exercise = new Exercise(name.trim());
      workout.exercises.push(exercise);
    }
    return exercise;
  }
}
