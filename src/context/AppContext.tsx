import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Exercise, Workout, WorkoutExercise, WorkoutTemplate, TemplateExercise } from '../types';
import { storage } from '../utils/storage';
import { sampleExercises } from '../data/mockData';

interface AppContextType {
  exercises: Exercise[];
  workouts: Workout[];
  templates: WorkoutTemplate[];
  addExercise: (name: string) => void;
  updateExercise: (id: string, name: string) => void;
  deleteExercise: (id: string) => void;
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  updateWorkout: (id: string, workout: Omit<Workout, 'id'>) => void;
  deleteWorkout: (id: string) => void;
  getLastWorkoutForExercise: (exerciseId: string) => Workout | null;
  addTemplate: (name: string, exercises: TemplateExercise[]) => void;
  updateTemplate: (id: string, name: string, exercises: TemplateExercise[]) => void;
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => void;
  getTemplate: (id: string) => WorkoutTemplate | null;
  loadExercisesFromTemplate: (templateId: string) => WorkoutExercise[];
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let storedExercises = storage.getExercises();
    
    if (storedExercises.length === 0) {
      storedExercises = sampleExercises;
      storage.setExercises(sampleExercises);
    }

    const storedWorkouts = storage.getWorkouts();
    const storedTemplates = storage.getTemplates();

    setExercises(storedExercises);
    setWorkouts(storedWorkouts);
    setTemplates(storedTemplates);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      storage.setExercises(exercises);
    }
  }, [exercises, initialized]);

  useEffect(() => {
    if (initialized) {
      storage.setWorkouts(workouts);
    }
  }, [workouts, initialized]);

  useEffect(() => {
    if (initialized) {
      storage.setTemplates(templates);
    }
  }, [templates, initialized]);

  const addExercise = (name: string) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name,
    };
    setExercises((prev) => [...prev, newExercise]);
  };

  const updateExercise = (id: string, name: string) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, name } : ex))
    );
    setWorkouts((prev) =>
      prev.map((w) => ({
        ...w,
        exercises: w.exercises.map((ex) =>
          ex.exerciseId === id ? { ...ex, exerciseName: name } : ex
        ),
      }))
    );
  };

  const deleteExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
    setWorkouts((prev) =>
      prev.map((w) => ({
        ...w,
        exercises: w.exercises.filter((ex) => ex.exerciseId !== id),
      })).filter((w) => w.exercises.length > 0)
    );
  };

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
    };
    setWorkouts((prev) => [newWorkout, ...prev]);
  };

  const updateWorkout = (id: string, workout: Omit<Workout, 'id'>) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...workout } : w))
    );
  };

  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const getLastWorkoutForExercise = (exerciseId: string): Workout | null => {
    const exerciseWorkouts = workouts
      .filter((w) => w.exercises.some((ex) => ex.exerciseId === exerciseId))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    if (exerciseWorkouts.length === 0) return null;

    const lastWorkout = exerciseWorkouts[0];
    const exerciseInWorkout = lastWorkout.exercises.find(
      (ex) => ex.exerciseId === exerciseId
    );

    if (!exerciseInWorkout) return null;

    return {
      ...lastWorkout,
      exercises: [exerciseInWorkout],
    };
  };

  const addTemplate = (name: string, exercises: TemplateExercise[]) => {
    const newTemplate: WorkoutTemplate = {
      id: Date.now().toString(),
      name,
      exercises,
    };
    setTemplates((prev) => [...prev, newTemplate]);
  };

  const updateTemplate = (id: string, name: string, exercises: TemplateExercise[]) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, name, exercises } : t
      )
    );
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const duplicateTemplate = (id: string) => {
    const templateToDuplicate = templates.find((t) => t.id === id);
    if (!templateToDuplicate) return;

    const newTemplate: WorkoutTemplate = {
      ...templateToDuplicate,
      id: Date.now().toString(),
      name: `${templateToDuplicate.name} (Copy)`,
    };
    setTemplates((prev) => [...prev, newTemplate]);
  };

  const getTemplate = (id: string): WorkoutTemplate | null => {
    return templates.find((t) => t.id === id) || null;
  };

  const loadExercisesFromTemplate = (templateId: string): WorkoutExercise[] => {
    const template = getTemplate(templateId);
    if (!template) return [];

    return template.exercises.map((templateExercise) => {
      const lastWorkout = getLastWorkoutForExercise(templateExercise.exerciseId);
      
      // Get sets from last workout, or empty placeholder if no history
      const sets = lastWorkout?.exercises[0]?.sets || [{ reps: 0, weight: 0 }];

      return {
        exerciseId: templateExercise.exerciseId,
        exerciseName: templateExercise.exerciseName,
        sets,
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        exercises,
        workouts,
        templates,
        addExercise,
        updateExercise,
        deleteExercise,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        getLastWorkoutForExercise,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        duplicateTemplate,
        getTemplate,
        loadExercisesFromTemplate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
