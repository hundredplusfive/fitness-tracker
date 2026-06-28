import { useState, FormEvent } from 'react';
import { useApp } from '../../context/AppContext';
import type { Workout, WorkoutExercise } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { ExerciseSelector } from './ExerciseSelector';
import { WorkoutExerciseSection } from './WorkoutExerciseSection';
import { TemplateSelector } from '../Templates/TemplateSelector';

interface WorkoutFormProps {
  workout?: Workout;
  onSubmit: () => void;
  onCancel: () => void;
}

export function WorkoutForm({ workout, onSubmit, onCancel }: WorkoutFormProps) {
  const { exercises, addWorkout, updateWorkout, getLastWorkoutForExercise, loadExercisesFromTemplate, getTemplate } =
    useApp();

  const [date, setDate] = useState(
    workout?.date.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
  );
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    workout?.exercises || []
  );
  const [notes, setNotes] = useState(workout?.notes || '');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState('');

  const selectedExerciseIds = workoutExercises.map((ex) => ex.exerciseId);

  const handleAddExercise = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const lastWorkout = getLastWorkoutForExercise(exerciseId);
    const lastExercise = lastWorkout?.exercises.find(
      (ex) => ex.exerciseId === exerciseId
    );

    const newExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: lastExercise?.sets || [{ reps: 0, weight: 0 }],
    };

    setWorkoutExercises((prev) => [...prev, newExercise]);
  };

  const handleLoadFromTemplate = (templateId: string) => {
    const templateExercises = loadExercisesFromTemplate(templateId);
    const template = getTemplate(templateId);
    if (template) {
      setSelectedTemplateName(template.name);
    }
    setWorkoutExercises(templateExercises);
  };

  const handleUpdateExercise = (updated: WorkoutExercise) => {
    setWorkoutExercises((prev) =>
      prev.map((ex) =>
        ex.exerciseId === updated.exerciseId ? updated : ex
      )
    );
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setWorkoutExercises((prev) =>
      prev.filter((ex) => ex.exerciseId !== exerciseId)
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (workoutExercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const workoutData = {
      exercises: workoutExercises,
      date: new Date(date),
      notes: notes.trim() || undefined,
    };

    if (workout) {
      updateWorkout(workout.id, workoutData);
    } else {
      addWorkout(workoutData);
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Load from Template (optional)</label>
        <div className="d-flex align-items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsTemplateSelectorOpen(true)}
          >
            Select Template
          </Button>
          {selectedTemplateName && (
            <span className="text-primary fw-medium">
              Using: {selectedTemplateName}
            </span>
          )}
        </div>
      </div>

      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3 className="h6 mb-0">Exercises</h3>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setIsSelectorOpen(true)}
          >
            + Add Exercise
          </Button>
        </div>

        {workoutExercises.length === 0 ? (
          <div className="text-center text-muted p-4 border rounded">
            <p className="mb-0">No exercises added yet. Click "Add Exercise" to get started!</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {workoutExercises.map((exercise) => (
              <WorkoutExerciseSection
                key={exercise.exerciseId}
                exercise={exercise}
                onUpdate={handleUpdateExercise}
                onRemove={() => handleRemoveExercise(exercise.exerciseId)}
                canRemove={workoutExercises.length > 1}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="notes">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          className="form-control"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How was your workout?"
          rows={3}
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{workout ? 'Update' : 'Log'} Workout</Button>
      </div>

      <Modal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        title="Add Exercise"
      >
        <ExerciseSelector
          selectedExerciseIds={selectedExerciseIds}
          onSelect={handleAddExercise}
          onClose={() => setIsSelectorOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
        title="Load from Template"
      >
        <TemplateSelector
          onSelect={handleLoadFromTemplate}
          onClose={() => setIsTemplateSelectorOpen(false)}
        />
      </Modal>
    </form>
  );
}
