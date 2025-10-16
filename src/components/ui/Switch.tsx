import { forwardRef } from 'react';

export const Switch = forwardRef<
  HTMLButtonElement,
  {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }
>(({ checked, onChange }, ref) => (
  <button
    ref={ref}
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
      checked ? 'border-brand bg-brand/80' : 'border-slate-300 bg-slate-200'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
        checked ? 'translate-x-5' : 'translate-x-1'
      }`}
    />
  </button>
));

Switch.displayName = 'Switch';
