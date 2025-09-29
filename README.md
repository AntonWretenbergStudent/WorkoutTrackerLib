# WorkoutTrackerLib

A small JavaScript library for tracking strength and endurance workouts.  
The module lets developers add workouts, log sets, and calculate stats such as volume, pace, and personal records.  
This project is a **library** for developers to use in their own apps — it is not a finished workout app for end users.
---

## Features

- Add workouts with exercises and sets (strength & endurance).
- Compute workout stats (strength volume, endurance totals, best 1RM).
- Weekly summaries (aggregate stats per week).
- Track personal records (estimated 1RM per exercise).
- Count workout streaks (consecutive days).
- Display workouts in a readable text format.

---

## Installation

Clone the repository:

```bash
git clone git@github.com:WretenbergAnton/WorkoutTrackerLib.git
cd WorkoutTrackerLib
```

## Usage Example

```js
import { WorkoutTracker } from "workouttrackerlib";

const wt = new WorkoutTracker();

// Add a workout
wt.addWorkout({ id: "w1", date: "2025-09-20", type: "strength" });

// Add an exercise and sets
wt.addExercise("w1", "Bench Press");
wt.addStrengthSet("w1", "Bench Press", { reps: 5, weightKg: 80 });

// Get stats
console.log(wt.workoutStats("w1"));
/*
{
  id: "w1",
  date: "2025-09-20",
  type: "strength",
  strengthVolumeKg: 400,
  endurance: null,
  details: [
    { exercise: "Bench Press", volumeKg: 400, best1RM: 93.3 }
  ]
}
*/
```

## API Overview

### Class: WorkoutTracker

- `addWorkout({ id, date, type })` → Add a new workout.
- `addExercise(workoutId, name)` → Add exercise to workout.
- `addStrengthSet(workoutId, exerciseName, { reps, weightKg })` → Log a strength set.
- `addEnduranceSet(workoutId, exerciseName, { distanceKm, minutes, seconds })` → Log an endurance set.
- `workoutStats(workoutId)` → Get stats for one workout.
- `weeklySummary(isoWeekStart)` → Get aggregated stats for a week.
- `personalRecords()` → Get best estimated 1RM per exercise.
- `streak(untilDateIso)` → Count consecutive workout days.
- `displayWorkout(workoutId)` → Get a readable text summary.

## Development & Testing

Manual tests: Run the demo app

```bash
node examples/demo.js
```

Automated tests (Jest):

```bash
npm test
```

See `testrapport.md` for detailed test report.

## Documentation

- `reflektion.md`: Reflections on Clean Code (chapters 2 & 3).
- `testrapport.md`: Test strategy and results.

## License

MIT License