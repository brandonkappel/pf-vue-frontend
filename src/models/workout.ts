import type { WorkoutItem } from "./workoutItem";

export interface Workout {
    _id: string,
    client: string,
    creator: string,
    date: Date,
    updatedAt: Date,
    name: string,
    personalWorkout: boolean,
    program: string,
    workoutItems: WorkoutItem[]
  }