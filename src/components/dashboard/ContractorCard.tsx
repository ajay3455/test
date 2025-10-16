import { useMemo } from 'react';
import type { ContractorSignIn } from '../../types';
import { formatCountdown, formatElapsed, formatTime } from '../../utils/format';
import { useNow } from '../../hooks/useNow';
import { StatusBadge } from './StatusBadge';

function determineStatus(entry: ContractorSignIn, countdownOverdue: boolean) {
  if (entry.is_signed_out) return 'signed_out';
  if (entry.approval_status === 'declined') return 'declined';
  if (entry.approval_status === 'pending') return countdownOverdue ? 'overdue' : 'pending';
  if (countdownOverdue) return 'overdue';
  return 'active';
}

export function ContractorCard({ entry, onOpen }: { entry: ContractorSignIn; onOpen: (entry: ContractorSignIn) => void }) {
  const now = useNow(1000 * 30);

  const countdownInfo = useMemo(() => {
    if (!entry.parking_duration_minutes) return null;
    return formatCountdown(entry.created_at, entry.parking_duration_minutes);
  }, [entry.created_at, entry.parking_duration_minutes, now]);

  const status = determineStatus(entry, countdownInfo?.overdue ?? false);

  const showKeysBadge = Boolean(entry.keys && entry.keys.length);
  const showParkingBadge = Boolean(entry.needs_parking);

  return (
    <article
      className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-soft transition hover:border-brand-light/80 hover:shadow-lg"
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{entry.name}</h3>
          <p className="text-sm text-slate-400">{entry.company}</p>
        </div>
        <StatusBadge status={status} />
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span>Signed in at {formatTime(entry.created_at)}</span>
        {!entry.is_signed_out && <span className="inline-flex items-center gap-1 text-green-300">⏱️ {formatElapsed(entry.created_at)}</span>}
        {countdownInfo && (
          <span className={`inline-flex items-center gap-1 ${countdownInfo.overdue ? 'text-rose-300' : 'text-sky-300'}`}>
            🅿️ {countdownInfo.overdue ? `${countdownInfo.value} overdue` : `${countdownInfo.value} remaining`}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {showKeysBadge && (
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-slate-300">
            🔑 {entry.keys?.length} key{(entry.keys?.length ?? 0) > 1 ? 's' : ''}
          </span>
        )}
        {showParkingBadge && (
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-700/60 bg-blue-900/30 px-3 py-1 text-sky-200">
            🚗 Parking
          </span>
        )}
        {entry.approval_status === 'pending' && (
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-700/60 bg-yellow-900/20 px-3 py-1 text-yellow-200">
            Awaiting approval
          </span>
        )}
      </div>

      {entry.contractor_notes && (
        <p className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-300">
          {entry.contractor_notes}
        </p>
      )}

      <button
        type="button"
        onClick={() => onOpen(entry)}
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-brand-light/90 hover:text-white"
      >
        View details
      </button>
    </article>
  );
}
