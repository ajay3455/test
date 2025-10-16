import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import toast from 'react-hot-toast';
import type { ContractorSignIn, FilterOptions } from '../../types';
import { formatDateHeading, matchesQuery } from '../../utils/format';
import { ContractorCard } from './ContractorCard';
import { ContractorDetailModal } from './ContractorDetailModal';

dayjs.extend(isBetween);

const defaultFilters: FilterOptions = {
  query: '',
  dateRange: 'today',
  customRange: null,
  signInStatus: 'active',
  approvalStatus: 'all',
  keyFilter: null,
  showJustParkingOnly: false
};

function applyFilters(entries: ContractorSignIn[], filters: FilterOptions) {
  return entries.filter((entry) => {
    if (filters.query) {
      const target = [
        entry.name,
        entry.company,
        entry.contact_number ?? '',
        entry.purpose_of_visit,
        entry.contractor_notes ?? '',
        entry.security_approval_notes ?? '',
        entry.security_sign_out_notes ?? ''
      ].join(' ');
      if (!matchesQuery(target, filters.query)) {
        return false;
      }
    }

    if (filters.dateRange === 'today') {
      if (!dayjs(entry.created_at).isSame(dayjs(), 'day')) return false;
    } else if (filters.dateRange === 'last7') {
      if (dayjs(entry.created_at).isBefore(dayjs().subtract(7, 'day'), 'day')) return false;
    } else if (filters.dateRange === 'custom' && filters.customRange) {
      const { start, end } = filters.customRange;
      if (!dayjs(entry.created_at).isBetween(start, end, 'day', '[]')) return false;
    }

    if (filters.signInStatus === 'active' && entry.is_signed_out) return false;
    if (filters.signInStatus === 'signed_out' && !entry.is_signed_out) return false;

    if (filters.approvalStatus !== 'all' && entry.approval_status !== filters.approvalStatus) return false;

    if (filters.keyFilter && !(entry.keys ?? []).includes(filters.keyFilter)) return false;

    if (filters.showJustParkingOnly && !entry.parking_duration_minutes) return false;

    return true;
  });
}

interface ContractorLogProps {
  signIns: ContractorSignIn[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function ContractorLog({ signIns, loading, error, onRefresh }: ContractorLogProps) {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [selected, setSelected] = useState<ContractorSignIn | null>(null);

  const filteredEntries = useMemo(() => applyFilters(signIns, filters), [signIns, filters]);

  const groupedEntries = useMemo(() => {
    const map = new Map<string, ContractorSignIn[]>();
    filteredEntries.forEach((entry) => {
      const key = dayjs(entry.created_at).format('YYYY-MM-DD');
      const group = map.get(key) ?? [];
      group.push(entry);
      map.set(key, group);
    });

    return [...map.entries()]
      .sort((a, b) => (a[0] > b[0] ? -1 : 1))
      .map(([dateKey, items]) => ({
        label: formatDateHeading(dateKey),
        items: items.sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
      }));
  }, [filteredEntries]);

  const allKeys = useMemo(() => {
    const set = new Set<string>();
    signIns.forEach((entry) => entry.keys?.forEach((key) => set.add(key)));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [signIns]);

  const quickFilter = useMemo(() => {
    if (filters.signInStatus === 'active' && filters.dateRange === 'all') return 'current';
    if (filters.dateRange === 'today' && filters.signInStatus === 'all') return 'today';
    return null;
  }, [filters]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Live Contractor Log</h2>
            <p className="text-sm text-slate-400">
              Real-time dashboard of all contractors signed in or awaiting approval.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setFilters((previous) => ({
                  ...previous,
                  signInStatus: 'active',
                  dateRange: 'all'
                }));
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                quickFilter === 'current'
                  ? 'bg-brand-light text-white'
                  : 'border border-slate-700 text-slate-300 hover:border-brand-light'
              }`}
            >
              Current Active
            </button>
            <button
              type="button"
              onClick={() => {
                setFilters((previous) => ({
                  ...previous,
                  dateRange: 'today',
                  signInStatus: 'all'
                }));
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                quickFilter === 'today'
                  ? 'bg-brand-light text-white'
                  : 'border border-slate-700 text-slate-300 hover:border-brand-light'
              }`}
            >
              Today&apos;s Activity
            </button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-slate-500">Search</label>
            <input
              placeholder="Search by name, company, purpose..."
              value={filters.query}
              onChange={(event) => setFilters((previous) => ({ ...previous, query: event.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-slate-500">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  dateRange: event.target.value as FilterOptions['dateRange'],
                  customRange: null
                }))
              }
            >
              <option value="today">Today</option>
              <option value="last7">Last 7 Days</option>
              <option value="all">All Time</option>
              <option value="custom">Custom Range</option>
            </select>
            {filters.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.customRange?.start ?? ''}
                  onChange={(event) =>
                    setFilters((previous) => ({
                      ...previous,
                      customRange: {
                        start: event.target.value,
                        end: previous.customRange?.end ?? event.target.value
                      }
                    }))
                  }
                />
                <input
                  type="date"
                  value={filters.customRange?.end ?? ''}
                  onChange={(event) =>
                    setFilters((previous) => ({
                      ...previous,
                      customRange: {
                        start: previous.customRange?.start ?? event.target.value,
                        end: event.target.value
                      }
                    }))
                  }
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-slate-500">Sign-In Status</label>
            <select
              value={filters.signInStatus}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  signInStatus: event.target.value as FilterOptions['signInStatus']
                }))
              }
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="signed_out">Signed Out</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-slate-500">Approval Status</label>
            <select
              value={filters.approvalStatus}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  approvalStatus: event.target.value as FilterOptions['approvalStatus']
                }))
              }
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-slate-500">Key Filter</label>
            <select
              value={filters.keyFilter ?? ''}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  keyFilter: event.target.value || null
                }))
              }
            >
              <option value="">Any key</option>
              {allKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-slate-500">Parking</label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={filters.showJustParkingOnly}
                onChange={(event) =>
                  setFilters((previous) => ({
                    ...previous,
                    showJustParkingOnly: event.target.checked
                  }))
                }
              />
              Show only Just Parking
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing <span className="text-slate-200">{filteredEntries.length}</span> of{' '}
          <span className="text-slate-200">{signIns.length}</span> total entries
        </p>
        <button
          type="button"
          onClick={() => {
            onRefresh();
            toast.success('Log refreshed');
          }}
          className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 hover:border-brand-light"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-2xl bg-slate-900/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedEntries.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">
              No sign-ins match the current filters.
            </div>
          ) : (
            groupedEntries.map((group) => (
              <div key={group.label} className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  {group.label}
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {group.items.map((entry) => (
                    <ContractorCard key={entry.id} entry={entry} onOpen={setSelected} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <ContractorDetailModal entry={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
