// src/WorkoutTracker.js
import { Workout, Exercise, StrengthSet, EnduranceSet } from "./models.js";
import {
  setVolumeKg,
  epley1RM,
  paceMinPerKm,
  speedKmH,
  durationMinFrom,
} from "./metrics.js";
import { isWithinWeek } from "./time.js";

export class WorkoutTracker {
  #workouts = new Map(); // id -> Workout

  addWorkout({ id, date, type }) {
    if (this.#workouts.has(id)) throw new Error("Duplicate workout id");
    this.#workouts.set(id, new Workout({ id, date, type }));
  }

  addExercise(workoutId, name) {
    const workout = this.#getWorkout(workoutId);
    if (!workout.exercises.some((e) => e.name === name)) {
      workout.exercises.push(new Exercise(name));
    }
  }

  addStrengthSet(workoutId, exerciseName, { reps, weightKg }) {
    const exercise = this.#getOrCreateExercise(workoutId, exerciseName);
    exercise.sets.push(new StrengthSet({ reps, weightKg }));
  }

  addEnduranceSet(workoutId, exerciseName, { distanceKm, minutes, seconds }) {
    const exercise = this.#getOrCreateExercise(workoutId, exerciseName);
    const durationMin = durationMinFrom({ minutes, seconds });
    exercise.sets.push(new EnduranceSet({ distanceKm, durationMin }));
  }

  // ---- stats per workout
  workoutStats(workoutId) {
    const workout = this.#getWorkout(workoutId);

    let totalStrengthVolumeKg = 0;
    let totalEnduranceDistanceKm = 0;
    let totalEnduranceDurationMin = 0;
    const exerciseDetails = [];

    for (const exercise of workout.exercises) {
      let exerciseVolumeKg = 0;
      let bestOneRepMax = 0;

      for (const set of exercise.sets) {
        if (set.kind === "strength") {
          exerciseVolumeKg += setVolumeKg(set);
          bestOneRepMax = Math.max(bestOneRepMax, epley1RM(set));
        } else {
          totalEnduranceDistanceKm += set.distanceKm;
          totalEnduranceDurationMin += set.durationMin;
        }
      }

      if (exerciseVolumeKg > 0) {
        totalStrengthVolumeKg += exerciseVolumeKg;
        exerciseDetails.push({
          exercise: exercise.name,
          volumeKg: exerciseVolumeKg,
          best1RM: round1(bestOneRepMax),
        });
      }
    }

    const hasEndurance = totalEnduranceDistanceKm > 0;
    const endurance = hasEndurance
      ? {
          distanceKm: round2(totalEnduranceDistanceKm),
          durationMin: round1(totalEnduranceDurationMin),
          paceMinPerKm: paceMinPerKm({
            distanceKm: totalEnduranceDistanceKm,
            durationMin: totalEnduranceDurationMin,
          }),
          speedKmH: round2(
            speedKmH({
              distanceKm: totalEnduranceDistanceKm,
              durationMin: totalEnduranceDurationMin,
            })
          ),
        }
      : null;

    return {
      id: workout.id,
      date: workout.date,
      type: workout.type,
      strengthVolumeKg: totalStrengthVolumeKg,
      endurance,
      details: exerciseDetails,
    };
  }

    // ---- weekly summary
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

    const hasEndurance = totalDistanceKm > 0;
    const endurance = hasEndurance
      ? {
          distanceKm: round2(totalDistanceKm),
          durationMin: round1(totalDurationMin),
          paceMinPerKm: totalDurationMin / totalDistanceKm,
        }
      : null;

    return {
      weekStart: isoWeekStart,
      workouts: workoutIds,
      strengthVolumeKg: totalStrengthVolumeKg,
      endurance,
    };
  }

  // ---- personal records
  personalRecords() {
    const best = new Map();

    for (const workout of this.#workouts.values()) {
      for (const exercise of workout.exercises) {
        for (const set of exercise.sets) {
          if (set.kind !== "strength") continue;
          const est = epley1RM(set);
          if (est > (best.get(exercise.name) ?? 0)) best.set(exercise.name, est);
        }
      }
    }

    return [...best.entries()]
      .map(([exercise, oneRM]) => ({ exercise, oneRM: round1(oneRM) }))
      .sort((a, b) => a.exercise.localeCompare(b.exercise));
  }

  // ---- streak
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

  #getWorkout(id) {
    const workout = this.#workouts.get(id);
    if (!workout) throw new Error("Workout not found");
    return workout;
  }

  #getOrCreateExercise(workoutId, name) {
    const workout = this.#getWorkout(workoutId);
    let exercise = workout.exercises.find((e) => e.name === name);
    if (!exercise) {
      exercise = new Exercise(name);
      workout.exercises.push(exercise);
    }
    return exercise;
  }
}

// local helpers
function round1(x) { return Math.round(x * 10) / 10; }
function round2(x) { return Math.round(x * 100) / 100; }
