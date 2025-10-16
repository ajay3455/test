import { forwardRef } from 'react';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`block text-sm font-medium text-slate-700 ${className}`}
    {...props}
  />
));

Label.displayName = 'Label';
