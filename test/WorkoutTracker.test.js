import { WorkoutTracker } from "../src/index.js"; 

describe("WorkoutTracker", () => {
  test("can add a workout and read back stats", () => {
    const wt = new WorkoutTracker();
    wt.addWorkout({ id: "w1", date: "2025-09-20", type: "strength" });

    wt.addExercise("w1", "Bench Press");
    wt.addStrengthSet("w1", "Bench Press", { reps: 5, weightKg: 80 });

    const stats = wt.workoutStats("w1");
    expect(stats.id).toBe("w1");
    expect(stats.type).toBe("strength");
    expect(stats.strengthVolumeKg).toBe(400); // 5 * 80
  });

  test("can add an endurance set and compute basic pace", () => {
    const wt = new WorkoutTracker();
    wt.addWorkout({ id: "w2", date: "2025-09-21", type: "endurance" });
    wt.addEnduranceSet("w2", "Easy Run", { distanceKm: 5, minutes: 25, seconds: 0 });

    const stats = wt.workoutStats("w2");
    expect(stats.endurance.distanceKm).toBe(5);
    expect(stats.endurance.durationMin).toBe(25);
    expect(stats.endurance.paceMinPerKm).toBeCloseTo(5.0, 2); // 5:00/km
  });
});
