import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseForm } from './ExerciseForm';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ExerciseListProps {
  onSelectExercise?: (exerciseId: string) => void;
}

export function ExerciseList({ onSelectExercise }: ExerciseListProps) {
  const { exercises, workouts, updateExercise, deleteExercise } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getLastWorkoutDate = (exerciseId: string) => {
    const exerciseWorkouts = workouts
      .filter((w) => w.exerciseId === exerciseId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    if (exerciseWorkouts.length === 0) return undefined;

    return exerciseWorkouts[0].date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleEdit = (id: string, name: string) => {
    setEditingExercise({ id, name });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleFormSubmit = (name: string) => {
    if (editingExercise) {
      updateExercise(editingExercise.id, name);
    }
    closeModal();
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteExercise(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExercise(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Exercises</h2>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Exercise</Button>
      </div>

      {exercises.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p className="mb-0">No exercises yet. Add your first exercise!</p>
        </div>
      ) : (
        <div className="row g-3">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="col-12 col-md-6">
              <ExerciseCard
                exercise={exercise}
                lastWorkoutDate={getLastWorkoutDate(exercise.id)}
                onEdit={() => handleEdit(exercise.id, exercise.name)}
                onDelete={() => handleDelete(exercise.id)}
                onSelect={
                  onSelectExercise ? () => onSelectExercise(exercise.id) : undefined
                }
              />
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen && !deleteConfirmId}
        onClose={closeModal}
        title={editingExercise ? 'Edit Exercise' : 'Add Exercise'}
      >
        <ExerciseForm
          initialValue={editingExercise?.name || ''}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Delete"
      >
        <div className="delete-confirm">
          <p>
            Are you sure you want to delete this exercise? All associated
            workouts will also be deleted.
          </p>
          <div className="delete-confirm-actions">
            <Button variant="secondary" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
