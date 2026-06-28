export interface Exercise {
  id: string;
  name: string;
  createdAt: Date;
}

export interface SetEntry {
  reps: number;
  weight: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: SetEntry[];
}

export interface Workout {
  id: string;
  exercises: WorkoutExercise[];
  date: Date;
  notes?: string;
}

export interface TemplateExercise {
  exerciseId: string;
  exerciseName: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: TemplateExercise[];
  createdAt: Date;
  updatedAt: Date;
}
