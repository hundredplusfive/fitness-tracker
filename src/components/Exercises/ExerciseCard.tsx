import type { Exercise } from '../../types/index.js';

interface ExerciseCardProps {
  exercise: Exercise;
  lastWorkoutDate?: string;
  onEdit: () => void;
  onDelete: () => void;
  onSelect?: () => void;
}

export function ExerciseCard({
  exercise,
  lastWorkoutDate,
  onEdit,
  onDelete,
  onSelect,
}: ExerciseCardProps) {
  return (
    <div className="card" onClick={onSelect} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="flex-grow-1">
          <h3 className="h6 mb-1 fw-semibold">{exercise.name}</h3>
          {lastWorkoutDate && (
            <p className="text-muted small mb-0">Last: {lastWorkoutDate}</p>
          )}
        </div>
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm btn-link text-decoration-none"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label="Edit exercise"
            style={{ fontSize: '18px' }}
          >
            ✏️
          </button>
          <button
            className="btn btn-sm btn-link text-decoration-none"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Delete exercise"
            style={{ fontSize: '18px' }}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
