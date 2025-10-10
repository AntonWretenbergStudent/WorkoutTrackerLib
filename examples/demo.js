import { WorkoutTracker } from "../src/index.js";

const wt = new WorkoutTracker();

// --- Seed data -------------------------------------------------------------
wt.addWorkout({ id: "w1", date: "2025-09-16", type: "strength" });
wt.addWorkout({ id: "w2", date: "2025-09-20", type: "endurance" });
wt.addWorkout({ id: "w3", date: "2025-09-23", type: "mixed" });

// w1: strength
wt.addExercise("w1", "Bench Press");
wt.addStrengthSet("w1", "Bench Press", { reps: 5, weightKg: 80 });
wt.addStrengthSet("w1", "Bench Press", { reps: 3, weightKg: 90 });

wt.addExercise("w1", "Squat");
wt.addStrengthSet("w1", "Squat", { reps: 5, weightKg: 100 });
wt.addStrengthSet("w1", "Squat", { reps: 3, weightKg: 110 });

// w2: endurance (two sets to show aggregation)
wt.addEnduranceSet("w2", "Easy Run", {
  distanceKm: 5,
  minutes: 28,
  seconds: 30,
});
wt.addEnduranceSet("w2", "Easy Run", {
  distanceKm: 2,
  minutes: 11,
  seconds: 0,
});

// w3: mixed
wt.addStrengthSet("w3", "Deadlift", { reps: 3, weightKg: 120 });
wt.addEnduranceSet("w3", "Tempo Run", {
  distanceKm: 3,
  minutes: 14,
  seconds: 45,
});

// --- Small helpers ---------------------------------------------------------
const section = (title) => console.log(`\n=== ${title} ===`);
const dump = (obj) => console.log(JSON.stringify(obj, null, 2));

// --- Display ----------------------------------------------------------------
section("displayWorkout(w1)");
console.log(wt.displayWorkout("w1"));

section("displayWorkout(w2)");
console.log(wt.displayWorkout("w2"));

section("displayWorkout(w3)");
console.log(wt.displayWorkout("w3"));

// --- Stats per workout ------------------------------------------------------
section("workoutStats(w1)");
dump(wt.workoutStats("w1"));

section("workoutStats(w2)");
dump(wt.workoutStats("w2"));

section("workoutStats(w3)");
dump(wt.workoutStats("w3"));

// --- Weekly summaries -------------------------------------------------------
section("weeklySummary(2025-09-15)  // includes w1(16), w2(20)");
dump(wt.weeklySummary("2025-09-15"));

section("weeklySummary(2025-09-22)  // includes w3(23)");
dump(wt.weeklySummary("2025-09-22"));

// --- Personal records & streaks --------------------------------------------
section("personalRecords()");
dump(wt.personalRecords());

section("streaks");
console.log("ending 2025-09-23:", wt.streak("2025-09-23"));
console.log("ending 2025-09-20:", wt.streak("2025-09-20"));
console.log("ending 2025-09-21:", wt.streak("2025-09-21"));

console.log("\n✅ Done.");

/* import { WorkoutTracker } from "workouttrackerlib";

const wt = new WorkoutTracker();

// Add a workout
wt.addWorkout({ id: "w1", date: "2025-09-20", type: "strength" });

// Add an exercise and sets
wt.addExercise("w1", "Bench Press");


wt.addStrengthSet("w1", "Bench Press", { reps: 5, weightKg: 80 });

console.log('-------Display Workout-------')
console.log(wt.displayWorkout("w1"))

console.log('------Weekly Summary------')
console.log(wt.weeklySummary("2025-09-20"))

console.log('------Personal Records-------')
console.log(wt.personalRecords())

console.log('-------Streaks-------')
console.log(`You have a streak of ${wt.streak("2025-09-20")} days!`)

console.log('-------Workout Stats-------')
console.log(wt.workoutStats("w1")); */