# Reflection

## Naming (Chapter 2)
| Name            | Explanation | Reflection |
|-----------------|-------------|------------|
| WorkoutTracker  | Main class  | The name shows clearly that the class tracks workouts. If it was only “Tracker”, it would be less clear. |
| addWorkout      | Public method | Starts with a verb (“add”), so it is clear that this method changes the state. |
| weeklySummary   | Public method | The name says exactly what it does: gives a summary for the week. Could also be `getWeeklySummary` for even clearer style. |
| fmtMinutes      | Helper function | The short form `fmt` is not clear for everyone. A longer name like `formatMinutes` would be easier to understand. |
| personalRecords | Public method | Uses training language (“personal records”). This makes sense for users in this domain and is better than a vague name like `bestValues`. |

### Chapter 2 Reflection
I often use good domain names (Workout, Endurance, Strength). This makes the code easier to understand. A weakness is that I sometimes use short forms like `fmtMinutes`, which are less clear. Next time, I will try to use full names so no extra explanation is needed.

---

## Functions (Chapter 3)
| Method         | Lines | Reflection |
|----------------|-------|------------|
| workoutStats   | ~30   | Now uses one loop for both strength and endurance. Easier to follow, but still does a lot. |
| weeklySummary  | ~30   | Reuses helpers and `workoutStats`. Less duplication, clearer purpose. |
| displayWorkout | ~25   | Mixes data and text formatting. Still simple, but could be split into smaller parts. |
| personalRecords| ~20   | Uses three loops, but does one clear thing: finds best 1RM. Easy to read. |
| streak         | ~15   | Very simple and only does one thing. |

### Example: Refactor to “do one thing”

Before, `workoutStats` looped twice over the same sets:

```js
// two separate loops over sets
for (const set of exercise.sets) {
  if (set.kind === "strength") {
    // accumulate volume and 1RM
  }
}
for (const set of exercise.sets) {
  if (set.kind === "endurance") {
    // accumulate distance and duration
  }
}
```

### After: Combined into a single loop

```js
// single pass over sets
for (const set of exercise.sets) {
  if (set.kind === "strength") {
    // accumulate volume and 1RM
  } else if (set.kind === "endurance") {
    // accumulate distance and duration
  }
}
```

**Why:** One pass is simpler and avoids duplication. This supports *Clean Code* chapter 3 — functions should “do one thing” and not repeat work.

---

### Chapter 3 Reflection
My longest functions (`workoutStats`, `weeklySummary`) used to do too much. By combining loops and adding private helpers, the code is now easier to read. Input validation also makes the public methods safer. It is still a challenge to balance between splitting into many small parts and keeping code short.

---

## Personal Reflection
Adding JSDoc makes the code easier to understand for other developers. Private methods reduce repeated code. Input validation helps avoid mistakes. I still sometimes use short names that are not clear. Next time I will aim for more consistent names and functions that only do one thing.
