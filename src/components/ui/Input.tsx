import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={className || 'mb-3'}>
      {label && <label className="form-label">{label}</label>}
      <input className={`form-control ${error ? 'is-invalid' : ''}`} {...props} />
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
