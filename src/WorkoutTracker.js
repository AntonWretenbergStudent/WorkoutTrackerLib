import { Workout, Exercise, StrengthSet, EnduranceSet } from "./models.js";
import {
  setVolumeKg,
  epley1RM,
  paceMinPerKm,
  speedKmH,
  durationMinFrom,
} from "./metrics.js";
import { isWithinWeek, fmtMinutes, fmtPace } from "./time.js";

// A little round fuction
function round(x, decimals = 0) {
  const f = 10 ** decimals;
  return Math.round((Number(x) || 0) * f) / f;
}

export class WorkoutTracker {
  #workouts = new Map(); // id -> Workout

  addWorkout({ id, date, type }) {
    if (this.#workouts.has(id)) throw new Error("Duplicate workout id");
    this.#workouts.set(id, new Workout({ id, date, type }));
  }

  addExercise(workoutId, name) {
    const workout = this.#getWorkout(workoutId);
    if (!workout.exercises.some((e) => e.name === name.trim())) {
      workout.exercises.push(new Exercise(name.trim()));
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

  #buildEnduranceNumeric({ distanceKm, durationMin }) {
    const hasData = distanceKm > 0 && durationMin > 0;
    if (!hasData) return null;

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

  workoutStats(workoutId) {
    const workout = this.#getWorkout(workoutId);

    let totalStrengthVolumeKg = 0;
    let totalEnduranceDistanceKm = 0;
    let totalEnduranceDurationMin = 0;
    const details = [];

    for (const exercise of workout.exercises) {
      // Styrka
      let volumeKg = 0;
      let best1RM = 0;
      for (const set of exercise.sets) {
        if (set.kind === "strength") {
          volumeKg += setVolumeKg(set);
          best1RM = Math.max(best1RM, epley1RM(set));
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

      for (const set of exercise.sets) {
        if (set.kind === "endurance") {
          totalEnduranceDistanceKm += set.distanceKm;
          totalEnduranceDurationMin += set.durationMin;
        }
      }
    }

    const enduranceNumeric = this.#buildEnduranceNumeric({
      distanceKm: totalEnduranceDistanceKm,
      durationMin: totalEnduranceDurationMin,
    });

    const enduranceFmt = this.#formatEndurance(enduranceNumeric);

    return {
      id: workout.id,
      date: workout.date,
      type: workout.type,
      strengthVolumeKg: totalStrengthVolumeKg,
      endurance: enduranceNumeric,
      enduranceFmt,
      details,
    };
  }

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
    const enduranceFmt = this.#formatEndurance(enduranceNumeric);

    return {
      weekStart: isoWeekStart,
      workouts: workoutIds,
      strengthVolumeKg: totalStrengthVolumeKg,
      endurance: enduranceNumeric,
      enduranceFmt,
    };
  }

  personalRecords() {
    const best = new Map(); // exerciseName -> oneRM

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
      .map(([exercise, oneRM]) => ({ exercise, oneRM: round(oneRM, 1) }))
      .sort((a, b) => a.exercise.localeCompare(b.exercise));
  }

  streak(untilDateIso) {
    const workoutDates = new Set(
      [...this.#workouts.values()].map((w) => w.date)
    );
    let cursor = new Date(untilDateIso);
    let count = 0;

    while (workoutDates.has(cursor.toISOString().slice(0, 10))) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

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
            paceMinPerKm({
              distanceKm: set.distanceKm,
              durationMin: set.durationMin,
            })
          );
          lines.push(`    ${set.distanceKm} km in ${niceTime} (${pace})`);
        }
      }
    }
    return lines.join("\n");
  }

  // ---- internals
  #getWorkout(id) {
    const workout = this.#workouts.get(id);
    if (!workout) throw new Error("Workout not found");
    return workout;
  }

  #getOrCreateExercise(workoutId, name) {
    const workout = this.#getWorkout(workoutId);
    let exercise = workout.exercises.find((e) => e.name === name.trim());
    if (!exercise) {
      exercise = new Exercise(name.trim());
      workout.exercises.push(exercise);
    }
    return exercise;
  }
}
