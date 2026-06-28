import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { WorkoutTemplate, TemplateExercise } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ExerciseSelector } from './ExerciseSelector';

interface TemplateFormProps {
  template?: WorkoutTemplate;
  onSubmit: () => void;
  onCancel: () => void;
}

export function TemplateForm({ template, onSubmit, onCancel }: TemplateFormProps) {
  const { templates, exercises, addTemplate, updateTemplate } = useApp();
  const [name, setName] = useState(template?.name || '');
  const [templateExercises, setTemplateExercises] = useState<TemplateExercise[]>(
    template?.exercises || []
  );
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [error, setError] = useState('');

  const selectedExerciseIds = templateExercises.map((ex) => ex.exerciseId);

  const handleAddExercise = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    setTemplateExercises((prev) => [
      ...prev,
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
      },
    ]);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setTemplateExercises((prev) =>
      prev.filter((ex) => ex.exerciseId !== exerciseId)
    );
  };

  const handleSubmit = () => {
    setError('');

    if (!name.trim()) {
      setError('Template name is required');
      return;
    }

    if (templateExercises.length === 0) {
      setError('Add at least one exercise');
      return;
    }

    if (templates.length >= 6 && !template) {
      setError('Maximum 6 templates allowed');
      return;
    }

    if (template) {
      updateTemplate(template.id, name.trim(), templateExercises);
    } else {
      addTemplate(name.trim(), templateExercises);
    }

    onSubmit();
  };

  return (
    <>
      <Input
        label="Template Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Push Day"
        autoFocus
      />

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3 className="h6 mb-0">Exercises</h3>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
          >
            {isSelectorOpen ? 'Hide Exercises' : '+ Add Exercise'}
          </Button>
        </div>

        {templateExercises.length === 0 && !isSelectorOpen ? (
          <div className="text-center text-muted p-4 border rounded">
            <p className="mb-0">No exercises added. Click "Add Exercise" to get started!</p>
          </div>
        ) : (
          <>
            {templateExercises.length > 0 && (
              <div className="d-flex flex-column gap-2 mb-3">
                {templateExercises.map((exercise) => (
                  <div
                    key={exercise.exerciseId}
                    className="d-flex justify-content-between align-items-center p-2 border rounded bg-light"
                  >
                    <span className="fw-medium">
                      {exercise.exerciseName}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-danger"
                      onClick={() => handleRemoveExercise(exercise.exerciseId)}
                      aria-label={`Remove ${exercise.exerciseName}`}
                      style={{ fontSize: '18px' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isSelectorOpen && (
              <ExerciseSelector
                selectedExerciseIds={selectedExerciseIds}
                onSelect={handleAddExercise}
                onRemove={handleRemoveExercise}
                onClose={() => setIsSelectorOpen(false)}
              />
            )}
          </>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {template ? 'Update' : 'Create'} Template
        </Button>
      </div>
    </>
  );
}
