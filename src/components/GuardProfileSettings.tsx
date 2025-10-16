import { useMemo } from 'react';
import { useGuardProfile } from '../context/GuardProfileContext';

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function GuardProfileSettings() {
  const { profile, updateProfile } = useGuardProfile();

  const initials = useMemo(() => {
    if (!profile.name) return 'GU';
    return profile.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0)?.toUpperCase())
      .join('');
  }, [profile.name]);

  return (
    <div className="flex w-full flex-1 flex-col items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-soft md:max-w-md md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light/20 text-lg font-semibold text-brand-light">
          {initials || 'GU'}
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Current Guard</p>
          <input
            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus-visible:ring-2 focus-visible:ring-brand-light"
            placeholder="Enter your name"
            value={profile.name}
            onChange={(event) => updateProfile({ ...profile, name: event.target.value })}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-3 text-sm text-slate-300">
          <span
            role="switch"
            aria-checked={profile.autoApprove}
            tabIndex={0}
            className={classNames(
              'relative inline-flex h-6 w-11 items-center rounded-full border border-slate-700 transition',
              profile.autoApprove ? 'bg-brand-light border-brand-light' : 'bg-slate-800'
            )}
            onClick={() => updateProfile({ ...profile, autoApprove: !profile.autoApprove })}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                updateProfile({ ...profile, autoApprove: !profile.autoApprove });
              }
            }}
          >
            <span
              className={classNames(
                'inline-block h-4 w-4 transform rounded-full bg-white transition',
                profile.autoApprove ? 'translate-x-5' : 'translate-x-1'
              )}
            />
          </span>
          Auto-approve my sign-ins
        </label>
        <p className="text-xs text-slate-500">
          When enabled, new entries are automatically marked as approved and attributed to you.
        </p>
      </div>
    </div>
  );
}
