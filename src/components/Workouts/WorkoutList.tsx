import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Workout } from '../../types';
import { WorkoutCard } from './WorkoutCard';
import { WorkoutForm } from './WorkoutForm';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function WorkoutList() {
  const { workouts, updateWorkout, deleteWorkout } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | undefined>();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleFormSubmit = () => {
    setIsModalOpen(false);
    setEditingWorkout(undefined);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteWorkout(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWorkout(undefined);
  };

  const groupedWorkouts = workouts.reduce((acc, workout) => {
    const dateKey = workout.date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(workout);
    return acc;
  }, {} as Record<string, Workout[]>);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Workout History</h2>
        <Button onClick={() => setIsModalOpen(true)}>+ Log Workout</Button>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p className="mb-3">No workouts logged yet. Start tracking your progress!</p>
          {/* <Button onClick={() => setIsModalOpen(true)}>Log Your First Workout</Button> */}
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {Object.entries(groupedWorkouts).map(([date, dateWorkouts]) => (
            <div key={date}>
              <h3 className="h6 text-muted text-uppercase fw-semibold mb-2" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>{date}</h3>
              <div className="d-flex flex-column gap-3">
                {dateWorkouts.map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onEdit={() => handleEdit(workout)}
                    onDelete={() => handleDelete(workout.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen && !deleteConfirmId}
        onClose={closeModal}
        title={editingWorkout ? 'Edit Workout' : 'Log Workout'}
      >
        <WorkoutForm
          workout={editingWorkout}
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
          <p>Are you sure you want to delete this workout?</p>
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
