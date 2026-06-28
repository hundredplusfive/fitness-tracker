import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  children,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  };

  const sizeClasses = {
    small: 'btn-sm',
    medium: '',
    large: 'btn-lg',
  };

  const classes = `btn ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-100' : ''} ${className}`.trim();

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
