import type { WorkoutTemplate } from '../../types';

interface TemplateCardProps {
  template: WorkoutTemplate;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function TemplateCard({
  template,
  onEdit,
  onDuplicate,
  onDelete,
}: TemplateCardProps) {
  const exerciseCount = template.exercises.length;
  const exerciseNames = template.exercises
    .slice(0, 3)
    .map((ex) => ex.exerciseName)
    .join(', ');

  const truncatedNames =
    exerciseCount > 3
      ? `${exerciseNames} +${exerciseCount - 3} more`
      : exerciseNames;

  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h3 className="h6 mb-0 fw-semibold">{template.name}</h3>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-light"
              onClick={onEdit}
              aria-label="Edit template"
              title="Edit"
              style={{ fontSize: '16px' }}
            >
              ✏️
            </button>
            <button
              className="btn btn-sm btn-light"
              onClick={onDuplicate}
              aria-label="Duplicate template"
              title="Duplicate"
              style={{ fontSize: '16px' }}
            >
              📋
            </button>
            <button
              className="btn btn-sm btn-light"
              onClick={onDelete}
              aria-label="Delete template"
              title="Delete"
              style={{ fontSize: '16px' }}
            >
              🗑️
            </button>
          </div>
        </div>

        <p className="text-muted small mb-1">
          {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
        </p>

        <p className="text-muted small mb-0">{truncatedNames}</p>
      </div>
    </div>
  );
}
