// 🌐 SECTION A: Header & Config
// FILE: src/components/dashboard/FilterBar.tsx
// LAST UPDATED: 2025-10-16

// 📝 A1: Imports
import type { FilterOptions } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

// ⚙️ SECTION B: Core Component Logic
interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  allKeys: string[];
}

export function FilterBar({ filters, onFilterChange, allKeys }: FilterBarProps) {
  const quickFilter =
    filters.signInStatus === 'active' && filters.dateRange === 'all'
      ? 'current'
      : filters.dateRange === 'today' && filters.signInStatus === 'all'
      ? 'today'
      : null;

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Live Contractor Log</h2>
          <p className="text-sm text-slate-500">
            Real-time dashboard of all contractors signed in or awaiting approval.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={quickFilter === 'current' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onFilterChange({ signInStatus: 'active', dateRange: 'all' })}
          >
            Current Active
          </Button>
          <Button
            variant={quickFilter === 'today' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onFilterChange({ dateRange: 'today', signInStatus: 'all' })}
          >
            Today&apos;s Activity
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-slate-500">Search</label>
          <Input
            placeholder="Search by name, company, purpose..."
            value={filters.query}
            onChange={(event) => onFilterChange({ query: event.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-slate-500">Date Range</label>
          <select
            className="rounded-xl border-slate-300 bg-slate-100 px-4 py-2.5 text-sm"
            value={filters.dateRange}
            onChange={(event) =>
              onFilterChange({
                dateRange: event.target.value as FilterOptions['dateRange'],
                customRange: null
              })
            }
          >
            <option value="today">Today</option>
            <option value="last7">Last 7 Days</option>
            <option value="all">All Time</option>
            <option value="custom">Custom Range</option>
          </select>
          {filters.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={filters.customRange?.start ?? ''}
                onChange={(event) =>
                  onFilterChange({
                    customRange: {
                      start: event.target.value,
                      end: filters.customRange?.end ?? event.target.value
                    }
                  })
                }
              />
              <Input
                type="date"
                value={filters.customRange?.end ?? ''}
                onChange={(event) =>
                  onFilterChange({
                    customRange: {
                      start: filters.customRange?.start ?? event.target.value,
                      end: event.target.value
                    }
                  })
                }
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wider text-slate-500">Sign-In Status</label>
          <select
            className="rounded-xl border-slate-300 bg-slate-100 px-4 py-2.5 text-sm"
            value={filters.signInStatus}
            onChange={(event) =>
              onFilterChange({
                signInStatus: event.target.value as FilterOptions['signInStatus']
              })
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
            className="rounded-xl border-slate-300 bg-slate-100 px-4 py-2.5 text-sm"
            value={filters.approvalStatus}
            onChange={(event) =>
              onFilterChange({
                approvalStatus: event.target.value as FilterOptions['approvalStatus']
              })
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
            className="rounded-xl border-slate-300 bg-slate-100 px-4 py-2.5 text-sm"
            value={filters.keyFilter ?? ''}
            onChange={(event) => onFilterChange({ keyFilter: event.target.value || null })}
          >
            <option value="">Any key</option>
            {allKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col justify-end">
          <label className="inline-flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-brand focus:ring-brand/50"
              checked={filters.showJustParkingOnly}
              onChange={(event) =>
                onFilterChange({
                  showJustParkingOnly: event.target.checked
                })
              }
            />
            Show only Just Parking
          </label>
        </div>
      </div>
    </div>
  );
}