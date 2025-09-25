# Test Report

**Strategy**  
1. I tested with a demo app (`examples/demo.js`) to check all features manually.  
2. I wrote two Jest tests (`tests/WorkoutTracker.test.js`) to check strength and endurance.  

**Environment**  
- Node.js v20  
- Jest v29  

---

## Test Cases (Jest)

| What was tested | How | Result |
|-----------------|-----|--------|
| Add workout + strength set | Created with id of`w1` with Bench Press 5×80 → `workoutStats("w1")` | ✅ Returned `strengthVolumeKg = 400`, `endurance = null` |
| Add endurance set | Created with id of`w2` with 5 km in 25:00 → `workoutStats("w2")` | ✅ Returned `distanceKm = 5`, `durationMin = 25`, `paceMinPerKm ≈ 5.0` |

---

## Manual Checks (demo app)

- `displayWorkout(id)` prints sets and times in a readable format.  
- `weeklySummary(YYYY-MM-DD)` only counts workouts from that week.  
- `personalRecords()` shows the best 1RM for each exercise.  
- `streak(untilDateIso)` counts correct consecutive days.  
- Input validation works: errors are thrown for invalid values (like empty exercise name or reps ≤ 0).  

---

## Summary
The two Jest tests confirm the most important cases (strength and endurance). The demo app checked the other functions. All results were correct, and validation worked as expected. The library behaves as intended.
