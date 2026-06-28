import { useApp } from '../../context/AppContext';

interface ExerciseSelectorProps {
  selectedExerciseIds: string[];
  onSelect: (exerciseId: string) => void;
  onClose: () => void;
}

export function ExerciseSelector({
  selectedExerciseIds,
  onSelect,
  onClose,
}: ExerciseSelectorProps) {
  const { exercises } = useApp();

  const availableExercises = exercises.filter(
    (ex) => !selectedExerciseIds.includes(ex.id)
  );

  return (
    <div>
      {/* <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="h5 mb-0">Select Exercise</h3>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div> */}

      {availableExercises.length === 0 ? (
        <div className="text-center text-muted py-4">
          <p className="mb-0">All exercises added!</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {availableExercises.map((exercise) => (
            <button
              key={exercise.id}
              className="btn btn-outline-secondary text-start"
              onClick={() => {
                onSelect(exercise.id);
                onClose();
              }}
            >
              {exercise.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
