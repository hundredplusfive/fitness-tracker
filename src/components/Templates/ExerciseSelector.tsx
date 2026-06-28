import { useApp } from '../../context/AppContext';

interface ExerciseSelectorProps {
  selectedExerciseIds: string[];
  onSelect: (exerciseId: string) => void;
  onRemove: (exerciseId: string) => void;
  onClose: () => void;
}

export function ExerciseSelector({
  selectedExerciseIds,
  onSelect,
  onRemove,
  onClose,
}: ExerciseSelectorProps) {
  const { exercises } = useApp();

  const availableExercises = exercises.filter(
    (ex) => !selectedExerciseIds.includes(ex.id)
  );

  return (
    <div className="mt-3">
      <h4 className="h6 text-muted text-uppercase fw-semibold mb-2" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
        Available Exercises
      </h4>
      {availableExercises.length === 0 ? (
        <div className="text-center text-muted py-3">
          <p className="mb-0">All exercises added!</p>
        </div>
      ) : (
        <div className="row g-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {availableExercises.map((exercise) => (
            <div key={exercise.id} className="col-12 col-sm-6">
              <button
                className="btn btn-outline-secondary w-100 text-start"
                onClick={() => onSelect(exercise.id)}
              >
                {exercise.name}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
