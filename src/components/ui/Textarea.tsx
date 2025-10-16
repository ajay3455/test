import { forwardRef } from 'react';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`block w-full rounded-xl border-slate-300 bg-slate-100 px-4 py-2.5 text-sm placeholder-slate-400 transition duration-200 ease-in-out focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/30 ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
