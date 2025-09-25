
export class Workout {
  /**
   * @param {{id:string, date:string, type:string}} param0
   * - `id`: unique workout identifier
   * - `date`: ISO date string (YYYY-MM-DD)
   * - `type`: workout type, e.g. "strength" | "endurance" | "mixed"
   */
  constructor({ id, date, type }) {
    this.id = id;
    this.date = date;
    this.type = type;
    this.exercises = [];
  }
}

export class Exercise {
  /** @param {string} name - Exercise name (e.g. "Bench Press") */
  constructor(name) {
    this.name = name;
    this.sets = [];
  }
}

export class StrengthSet {
  /** @param {{reps:number, weightKg:number}} param0 */
  constructor({ reps, weightKg }) {
    this.kind = "strength";
    this.reps = reps;
    this.weightKg = weightKg;
  }
}

export class EnduranceSet {
  /**
   * @param {{distanceKm:number, durationMin:number}} param0
   * @throws {Error} if durationMin < 0
   */
  constructor({ distanceKm, durationMin }) {
    this.kind = "endurance";
    this.distanceKm = distanceKm;
    if (!Number.isFinite(durationMin) || durationMin < 0) {
      throw new Error("EnduranceSet requires a non-negative durationMin.");
    }
    this.durationMin = durationMin;
  }
}
