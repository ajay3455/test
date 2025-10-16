import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import toast from 'react-hot-toast';
import type { ContractorSignIn, FilterOptions } from '../../types';
import { formatDateHeading, matchesQuery } from '../../utils/format';
import { Button } from '../ui/Button';
import { ContractorCard } from './ContractorCard';
import { ContractorDetailModal } from './ContractorDetailModal';
import { FilterBar } from './FilterBar';

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

    if (filters.approvalStatus !== 'all' && entry.approval_status !== filters.approvalStatus)
      return false;

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

  return (
    <section className="space-y-6">
      <FilterBar
        filters={filters}
        onFilterChange={(newFilters) => setFilters((f) => ({ ...f, ...newFilters }))}
        allKeys={allKeys}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-700">{filteredEntries.length}</span> of{' '}
          <span className="font-semibold text-slate-700">{signIns.length}</span> total entries
        </p>
        <Button
          type="button"
          onClick={() => {
            onRefresh();
            toast.success('Log refreshed');
          }}
          variant="secondary"
          size="sm"
        >
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-100/80 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-2xl bg-slate-200/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedEntries.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-100/60 p-10 text-center text-slate-500">
              No sign-ins match the current filters.
            </div>
          ) : (
            groupedEntries.map((group) => (
              <div key={group.label} className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
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
