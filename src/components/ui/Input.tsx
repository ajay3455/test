import { forwardRef } from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`block w-full rounded-xl border-slate-300 bg-slate-100 px-4 py-2.5 text-sm placeholder-slate-400 transition duration-200 ease-in-out focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30 ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
