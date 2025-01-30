export interface WorkoutItem {
  name: string;
  description: string;
  comments: string;
  clientComments: [];
  exercise: {};
  customExercise: string; // For custom exercises typed in by the user
  sets: number;
  reps: number;
  weight: number; // Optional, depending on the type of exercise
  time: number; // Optional, for timed exercises
  result: string; // This can store either 'time' or 'reps' based on the exercise
  type: string;
  scoreType: string;
}
