type StatusType = 'active' | 'pending' | 'declined' | 'signed_out' | 'overdue';

const STYLES: Record<StatusType, { label: string; className: string }> = {
  active: {
    label: 'Approved',
    className: 'bg-green-100 text-green-800 border-green-200'
  },
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  declined: {
    label: 'Declined',
    className: 'bg-red-100 text-red-800 border-red-200'
  },
  signed_out: {
    label: 'Signed Out',
    className: 'bg-slate-100 text-slate-600 border-slate-200'
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-red-100 text-red-800 border-red-200 animate-pulse'
  }
};

export function StatusBadge({ status }: { status: StatusType }) {
  const config = STYLES[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
}
