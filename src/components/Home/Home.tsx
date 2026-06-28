import { useState } from 'react';
import { WorkoutForm } from '../Workouts/WorkoutForm';
import { ExerciseList } from '../Exercises/ExerciseList';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSubmit = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="bg-primary text-white rounded p-4 mb-4 text-center">
        <h2 className="h4 mb-3">Quick Log</h2>
        <Button
          size="large"
          fullWidth
          variant="secondary"
          className="bg-white text-primary fw-semibold border-0"
          onClick={() => setIsModalOpen(true)}
        >
          + Log Workout
        </Button>
      </div>

      <div className="card p-4 mb-4">
        <ExerciseList />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="Log Workout"
      >
        <WorkoutForm
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
