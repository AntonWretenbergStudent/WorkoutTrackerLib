import { Workout, Exercise, StrengthSet, EnduranceSet } from "./models.js";
import { setVolumeKg, epley1RM, paceMinPerKm, speedKmH } from "./metrics.js";
import { isWithinWeek } from "./time.js";

export class WorkoutTracker {
  #workouts = new Map();

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

  addEnduranceSet(workoutId, exerciseName, { distanceKm, durationMin }) {
    const exercise = this.#getOrCreateExercise(workoutId, exerciseName)
    exercise.sets.push(new EnduranceSet({ distanceKm, durationMin }))
  }

  // Stats per workout

  

 #getWorkout(id) {
    const workout = this.#workouts.get(id);
    if (!workout) throw new Error("Workout not found");
    return workout;
  }
  #getOrCreateExercise(workoutId, name) {
    const workout = this.#getWorkout(workoutId);
    let exercise = workout.exercises.find(e => e.name === name);
    if (!exercise) {
      exercise = new Exercise(name);
      workout.exercises.push(exercise);
    }
    return exercise;
  }
}
