export class Workout {
  constructor({ id, date, type }) {
    this.id = id;
    this.date = date;
    this.type = type;
    this.exercises = [];
  }
}

export class Exercise {
  constructor(name) {
    this.name = name;
    this.sets = [];
  }
}

export class StrengthSet {
  constructor({ reps, weightKg }) {
    this.kind = "strength";
    this.reps = reps;
    this.weightKg = weightKg;
  }
}

export class EnduranceSet {
  constructor({ distanceKm, durationMin }) {
    this.kind = "endurance";
    this.distanceKm = distanceKm;
    if (!Number.isFinite(durationMin) || durationMin < 0) {
      throw new Error("EnduranceSet requires a non-negative durationMin.");
    }
    this.durationMin = durationMin;
  }
}
