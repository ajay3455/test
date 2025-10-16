type StatusType = 'active' | 'pending' | 'declined' | 'signed_out' | 'overdue';

const STYLES: Record<StatusType, { label: string; className: string }> = {
  active: {
    label: 'Approved',
    className: 'bg-green-500/10 text-green-300 border-green-500/40'
  },
  pending: {
    label: 'Pending Approval',
    className: 'bg-yellow-500/10 text-yellow-200 border-yellow-500/40'
  },
  declined: {
    label: 'Declined',
    className: 'bg-rose-500/10 text-rose-200 border-rose-500/40'
  },
  signed_out: {
    label: 'Signed Out',
    className: 'bg-slate-500/10 text-slate-300 border-slate-500/40'
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-rose-500/20 text-rose-200 border-rose-500/60 animate-pulse'
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
