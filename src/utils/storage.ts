import type { Exercise, Workout, WorkoutTemplate } from '../types';

const EXERCISES_KEY = 'fitness_tracker_exercises';
const WORKOUTS_KEY = 'fitness_tracker_workouts';
const TEMPLATES_KEY = 'fitness_tracker_templates';

function isNewWorkoutFormat(workout: any): boolean {
  return workout && Array.isArray(workout.exercises);
}

export const storage = {
  getExercises: (): Exercise[] => {
    const data = localStorage.getItem(EXERCISES_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return parsed.map((ex: any) => ({
      ...ex,
      createdAt: new Date(ex.createdAt),
    }));
  },

  setExercises: (exercises: Exercise[]): void => {
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  },

  getWorkouts: (): Workout[] => {
    const data = localStorage.getItem(WORKOUTS_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    
    const validWorkouts = parsed.filter((w: any) => isNewWorkoutFormat(w));
    
    if (validWorkouts.length !== parsed.length) {
      localStorage.setItem(WORKOUTS_KEY, JSON.stringify(validWorkouts));
    }
    
    return validWorkouts.map((w: any) => ({
      ...w,
      date: new Date(w.date),
    }));
  },

  setWorkouts: (workouts: Workout[]): void => {
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  },

  getTemplates: (): WorkoutTemplate[] => {
    const data = localStorage.getItem(TEMPLATES_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return parsed.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    }));
  },

  setTemplates: (templates: WorkoutTemplate[]): void => {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  },

  saveTemplate: (template: WorkoutTemplate): void => {
    const templates = storage.getTemplates();
    const existingIndex = templates.findIndex((t) => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }
    
    storage.setTemplates(templates);
  },

  deleteTemplate: (id: string): void => {
    const templates = storage.getTemplates();
    const filtered = templates.filter((t) => t.id !== id);
    storage.setTemplates(filtered);
  },
};
