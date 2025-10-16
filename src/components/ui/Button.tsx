import { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-brand text-white hover:bg-brand-light disabled:bg-brand/60',
      secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 disabled:bg-slate-200/60',
      ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
      danger: 'bg-danger text-white hover:bg-red-600'
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-full font-semibold transition duration-200 ease-in-out disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
