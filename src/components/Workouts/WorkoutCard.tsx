import type { Workout } from '../../types';

interface WorkoutCardProps {
  workout: Workout;
  onEdit: () => void;
  onDelete: () => void;
}

export function WorkoutCard({ workout, onEdit, onDelete }: WorkoutCardProps) {
  const formattedDate = workout.date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h3 className="h6 mb-1 fw-semibold">Workout Session</h3>
            <p className="text-muted small mb-0">{formattedDate}</p>
            <p className="text-muted small mb-0">
              {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-light"
              onClick={onEdit}
              aria-label="Edit workout"
              style={{ fontSize: '16px' }}
            >
              ✏️
            </button>
            <button
              className="btn btn-sm btn-light"
              onClick={onDelete}
              aria-label="Delete workout"
              style={{ fontSize: '16px' }}
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="d-flex flex-column gap-2">
          {workout.exercises.map((exercise) => (
            <div key={exercise.exerciseId} className="border rounded">
              <div className="bg-light p-2 d-flex justify-content-between align-items-center">
                <span className="fw-semibold">{exercise.exerciseName}</span>
                <span className="text-muted small">
                  {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="p-2 d-flex flex-column gap-1">
                {exercise.sets.map((set, index) => (
                  <div key={index} className="d-flex gap-2">
                    <span className="text-muted" style={{ minWidth: '70px' }}>
                      Set {index + 1}:
                    </span>
                    <span className="fw-medium">
                      {set.reps} reps @ {set.weight}kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {workout.notes && (
          <div className="mt-3 p-2 bg-light rounded">
            <span className="fw-semibold text-muted">Notes: </span>
            <span>{workout.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
}
