# Reflection

# Reflection – Chapter 2: Meaningful Names

## Naming

| Name | Explanation | Reflection |
|------|--------------|-------------|
| **WorkoutTracker** | Main class | A very clear **Intention-Revealing Name**. It tells exactly what the class does — tracks workouts. This follows the *Clean Code* rule that a name should show **why** it exists and **what** it does. |
| **addWorkout** | Public method | Follows the rule that **Method Names** should start with a **verb**. It clearly says it adds something. Simple and easy to understand. |
| **weeklySummary** | Public method | Uses **domain language** (“weekly”), which is great. It fits with *Clean Code’s* advice to use **Problem Domain Names**. Still, `getWeeklySummary` could be a bit clearer and more consistent with other getter methods. |
| **fmtMinutes** | Helper function | Breaks the rule **Use Pronounceable Names**. “fmt” is short but not easy to say or understand. A full name like `formatMinutes` would be clearer for new readers. |
| **personalRecords** | Public method | Very good **Domain-Specific Name**. It’s clear to anyone in the fitness context. It also adds **Meaningful Context**, which *Clean Code* recommends over generic names like `bestValues`. |

---

## Chapter 2 Reflection

In my code, I used many **Intention-Revealing Names** like `Workout`, `Exercise`, and `EnduranceSet`. These names make it easy to see what the code does without needing comments.  

Sometimes I use short names like `fmtMinutes`, which goes against the **Use Pronounceable Names** rule. It’s faster to type, but not as readable. I’ll try to use full words next time.  

I also avoided **Disinformation**, meaning I didn’t use names that could confuse readers. For example, I didn’t write `workoutList` when it’s actually a `Map`. Just calling it `workouts` is cleaner and safer if the structure changes later.  

Next time, I’ll try to be more consistent with the **One Word per Concept** rule — for example, always using `add` (not mixing with `create`) when adding data. I’ll also remember that **clarity is more important than being clever**, so I’ll keep avoiding names like `PRFinder` and instead use something clear like `calculatePersonalRecords`.


---

# Reflection – Chapter 3: Functions


| Function | What it does | Reflection |
|---|---|---|
| **workoutStats** | Collects and calculates both strength and endurance data | Rewritten to use **one loop** instead of two, which removes duplication and follows the **DRY** rule. It still mixes different levels (calculations, formatting, and data gathering). Splitting it into smaller helpers like `accumulateStrength` and `accumulateEndurance` would make it follow **Do One Thing** and **One Level of Abstraction per Function**. |
| **weeklySummary** | Builds a summary of all workouts within one week | This function is short and clear. It reuses helpers like `workoutStats`, which makes it easy to read and fits the **Stepdown Rule** — the code tells a top-down story: “get workouts, summarize them, return results.” |
| **displayWorkout** | Creates a printable string version of a workout | It’s easy to follow but mixes logic and text output. According to **Clean Code**, this breaks **One Level of Abstraction**. It would be better to extract the text parts into helpers like `formatStrengthSet()` and `formatEnduranceSet()`. |
| **personalRecords** | Finds the best one-rep max (1RM) for each exercise | A good example of **Do One Thing** and **Command–Query Separation**. It only calculates and returns data, without changing any state. Clear and easy to test. |
| **streak** | Counts how many days in a row a user trained | Simple and focused — it follows both **Small!** and **Do One Thing** perfectly. |

---


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

## Chapter 3 Reflection

This chapter taught me that good functions are like short sentences — they should do **one thing**, be **small**, and use **clear names**.  
When I first wrote my functions, some were long and handled too many details. After reading *Clean Code*, I started to break them into smaller parts and think about **levels of abstraction**.  

For example, `workoutStats` used to have two loops doing almost the same work. Now it only loops once, which follows **Don’t Repeat Yourself (DRY)** and makes it easier to understand. I also made sure that `weeklySummary` only organizes logic while helpers do the real calculations — this follows the **Stepdown Rule** that says code should read from high to low level like a story.

I learned that each function should either **do something** or **answer something** never both. This is **Command–Query Separation (CQS)**, and I applied it to my module.

I also learnd much about **naming**. Short names like `fmtMinutes` work but are not very clear. *Clean Code* recommends **Use Descriptive Names**, so I now prefer full names like `formatMinutes`. Long names are fine if they make the code easy to understand.

Finally, I understand that **side effects** make code confusing. Each function should keep its promises if it says “get stats,” it should only do that and not also change data. I’ve kept my public methods free from hidden changes, which matches the **Have No Side Effects** rule.

---

## Personal Reflection

After working through this chapter, I see that clear and small functions make everything easier reading, debugging, and testing. And I would now say that i think more like an editor: first write the logic, then clean it up by removing duplication, shortening long parts and renaming unclear functions. In the feature i will definitely think way more about functions and naming!