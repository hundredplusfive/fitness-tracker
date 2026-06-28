import { useState, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ExerciseFormProps {
  initialValue?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export function ExerciseForm({
  initialValue = '',
  onSubmit,
  onCancel,
}: ExerciseFormProps) {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Exercise name is required');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (name.trim().length > 50) {
      setError('Name must be less than 50 characters');
      return;
    }

    onSubmit(name.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Exercise Name"
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError('');
        }}
        error={error}
        placeholder="e.g., Bench Press"
        autoFocus
      />
      <div className="d-flex justify-content-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialValue ? 'Update' : 'Add'} Exercise</Button>
      </div>
    </form>
  );
}
