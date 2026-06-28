import { useState } from 'react';
import type { WorkoutExercise } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface WorkoutExerciseSectionProps {
  exercise: WorkoutExercise;
  onUpdate: (updated: WorkoutExercise) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function WorkoutExerciseSection({
  exercise,
  onUpdate,
  onRemove,
  canRemove,
}: WorkoutExerciseSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const getInputValue = (index: number, field: 'reps' | 'weight', storedValue: number): string => {
    const key = `${index}-${field}`;
    return inputValues[key] ?? storedValue.toString();
  };

  const handleAddSet = () => {
    const newSets = [...exercise.sets, { reps: 0, weight: 0 }];
    onUpdate({ ...exercise, sets: newSets });
    setIsExpanded(true);
  };

  const handleRemoveSet = (index: number) => {
    if (exercise.sets.length > 1) {
      const newSets = exercise.sets.filter((_, i) => i !== index);
      onUpdate({ ...exercise, sets: newSets });
    }
  };

  const handleSetChange = (
    index: number,
    field: 'reps' | 'weight',
    value: string
  ) => {
    const key = `${index}-${field}`;
    
    // Update display value immediately so user sees what they type
    setInputValues(prev => ({ ...prev, [key]: value }));
    
    // Update actual state with parsed number
    const newSets = [...exercise.sets];
    const numValue = field === 'weight' ? parseFloat(value) : parseInt(value);
    newSets[index] = { 
      ...newSets[index], 
      [field]: isNaN(numValue) ? 0 : numValue 
    };
    
    onUpdate({ ...exercise, sets: newSets });
  };

  return (
    <div className="border rounded">
      <div
        className="bg-light p-2 d-flex justify-content-between align-items-center"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        <div className="d-flex align-items-center gap-2 flex-grow-1">
          <button
            className="btn btn-sm btn-link text-decoration-none p-0"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <h4 className="h6 mb-0 fw-semibold">
            {exercise.exerciseName}
          </h4>
          <span className="text-muted small">
            {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''}
          </span>
        </div>
        {canRemove && (
          <button
            className="btn btn-sm text-grey"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="Remove exercise"
          >
            ✕
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="p-3">
          <div className="d-flex gap-2 mb-2">
            <span style={{ minWidth: '60px' }}></span>
            <div className="d-flex gap-2 flex-grow-1">
              <div className="flex-grow-1">
                <label className="form-label small mb-1" >Weight (kg)</label>
              </div>
              <div className="flex-grow-1">
                <label className="form-label small mb-1">Reps</label>
              </div>
            </div>
            <span style={{ minWidth: '60px' }}></span>
          </div>

          {exercise.sets.map((set, index) => (
            <div key={index} className="d-flex align-items-center gap-2 mb-2">
              <span className="text-muted fw-medium mb-3" style={{ minWidth: '50px' }}>
                Set {index + 1}
              </span>
              <div className="d-flex gap-2 flex-grow-1">
                <div className="flex-grow-1">
                  <Input
                    key={`weight-${index}`}
                    label=""
                    type="text"
                    inputMode="decimal"
                    value={getInputValue(index, 'weight', set.weight)}
                    onChange={(e) =>
                      handleSetChange(index, 'weight', e.target.value)
                    }
                  />
                </div>
                <div className="flex-grow-1">
                  <Input
                    key={`reps-${index}`}
                    label=""
                    type="text"
                    inputMode="numeric"
                    value={getInputValue(index, 'reps', set.reps)}
                    onChange={(e) =>
                      handleSetChange(index, 'reps', e.target.value)
                    }
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-danger mb-3"
                onClick={() => handleRemoveSet(index)}
                aria-label="Remove set"
                disabled={exercise.sets.length === 1}
                style={{ fontSize: '20px' }}
              >
                -
              </button>
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={handleAddSet}
            fullWidth
          >
            + Add Set
          </Button>
        </div>
      )}
    </div>
  );
}
