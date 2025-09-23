import { WorkoutTracker } from "../src/WorkoutTracker.js";
import { fmtMinutes, fmtPace } from "../src/time.js";
import { paceMinPerKm, speedKmH, epley1RM, setVolumeKg, durationMinFrom } from "../src/metrics.js";
const wt = new WorkoutTracker();
wt.addWorkout({ id: "w1", date: "2025-09-23", type: "endurance" });

wt.addEnduranceSet("w1", "Easy Run", { distanceKm: 5, minutes: 28, seconds: 60 });

const durationMin = durationMinFrom({ minutes: 90, seconds: 43 });

const pace = paceMinPerKm({ distanceKm: 5, durationMin });
const speed = speedKmH({ distanceKm: 5, durationMin });

console.log("Duration:", fmtMinutes(durationMin));
console.log("Pace:", fmtPace(pace));
console.log("Speed (km/h):", speed.toFixed(2));