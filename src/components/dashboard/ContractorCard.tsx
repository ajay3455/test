import { useMemo } from 'react';
import type { ContractorSignIn } from '../../types';
import { formatCountdown, formatElapsed, formatTime } from '../../utils/format';
import { useNow } from '../../hooks/useNow';
import { StatusBadge } from './StatusBadge';
import { Button } from '../ui/Button';

function determineStatus(entry: ContractorSignIn, countdownOverdue: boolean) {
  if (entry.is_signed_out) return 'signed_out';
  if (entry.approval_status === 'declined') return 'declined';
  if (entry.approval_status === 'pending') return 'pending';
  if (countdownOverdue) return 'overdue';
  return 'active';
}

export function ContractorCard({
  entry,
  onOpen
}: {
  entry: ContractorSignIn;
  onOpen: (entry: ContractorSignIn) => void;
}) {
  useNow(1000 * 30);

  const countdownInfo = useMemo(() => {
    if (!entry.parking_duration_minutes) return null;
    return formatCountdown(entry.created_at, entry.parking_duration_minutes);
  }, [entry.created_at, entry.parking_duration_minutes]);

  const status = determineStatus(entry, countdownInfo?.overdue ?? false);

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-soft transition hover:border-brand/80 hover:shadow-lg">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{entry.name}</h3>
          <p className="text-sm text-slate-500">{entry.company}</p>
        </div>
        <StatusBadge status={status} />
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
        <span>Signed in at {formatTime(entry.created_at)}</span>
        {!entry.is_signed_out && (
          <span className="inline-flex items-center gap-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25a.75.75 0 0 0-1.5 0v4.5c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V4.75Z"
                clipRule="evenodd"
              />
            </svg>
            {formatElapsed(entry.created_at)}
          </span>
        )}
        {countdownInfo && (
          <span
            className={`inline-flex items-center gap-1 ${
              countdownInfo.overdue ? 'text-red-600' : 'text-blue-600'
            }`}
          >
            🅿️ {countdownInfo.overdue ? `${countdownInfo.value} overdue` : `${countdownInfo.value} left`}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {entry.keys && entry.keys.length > 0 && (
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-slate-600">
            🔑 {entry.keys?.length} key{(entry.keys?.length ?? 0) > 1 ? 's' : ''}
          </span>
        )}
        {entry.needs_parking && (
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-100 px-3 py-1 text-blue-700">
            🚗 Parking
          </span>
        )}
        {entry.approval_status === 'pending' && (
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1 text-yellow-700">
            Awaiting approval
          </span>
        )}
      </div>

      {entry.contractor_notes && (
        <p className="mt-4 rounded-xl border border-slate-200 bg-slate-100/80 p-3 text-sm text-slate-600">
          {entry.contractor_notes}
        </p>
      )}

      <Button
        type="button"
        onClick={() => onOpen(entry)}
        className="mt-5"
        variant="secondary"
        size="md"
      >
        View details
      </Button>
    </article>
  );
}
