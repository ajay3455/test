import { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { PreAuthorizedContractor } from '../../types';
import { usePreAuthorizedContractors } from '../../hooks/usePreAuthorizedContractors';
import { ManageContractorModal } from './ManageContractorModal';
import { MergeContractorsModal } from './MergeContractorsModal';
import { supabase } from '../../lib/supabaseClient';

function splitCsvLine(line: string) {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map((value) => value.replace(/^"|"$/g, ''));
}

function convertToCsv(contractors: PreAuthorizedContractor[]) {
  const headers = [
    'id',
    'name',
    'company',
    'contact_number',
    'category',
    'notes',
    'is_active',
    'archived',
    'known_license_plates',
    'profile_picture_url'
  ];

  const rows = contractors.map((contractor) => [
    contractor.id,
    contractor.name,
    contractor.company,
    contractor.contact_number ?? '',
    contractor.category ?? '',
    contractor.notes?.replace(/"/g, '""') ?? '',
    String(contractor.is_active ?? true),
    String(contractor.archived ?? false),
    (contractor.known_license_plates ?? []).join('|'),
    contractor.profile_picture_url ?? ''
  ]);

  const csvRows = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))];
  return csvRows.join('\n');
}

export function PreAuthorizedDirectory() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { contractors, loading, error, refresh } = usePreAuthorizedContractors();
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [editing, setEditing] = useState<PreAuthorizedContractor | null>(null);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return contractors.filter((contractor) => {
      if (!showArchived && contractor.archived) return false;
      if (!search) return true;
      const haystack = [
        contractor.name,
        contractor.company,
        contractor.category ?? '',
        contractor.notes ?? '',
        contractor.contact_number ?? ''
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [contractors, search, showArchived]);

  const toggleSelect = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    );
  };

  const handleArchiveToggle = async (contractor: PreAuthorizedContractor) => {
    const { error } = await supabase
      .from('pre_authorized_contractors')
      .update({ archived: !contractor.archived })
      .eq('id', contractor.id);

    if (error) {
      toast.error(`Failed to update contractor: ${error.message}`);
      return;
    }
    toast.success(`Contractor ${contractor.archived ? 'restored' : 'archived'}.`);
    refresh();
  };

  const handleActiveToggle = async (contractor: PreAuthorizedContractor) => {
    const { error } = await supabase
      .from('pre_authorized_contractors')
      .update({ is_active: !contractor.is_active })
      .eq('id', contractor.id);
    if (error) {
      toast.error(`Failed to update status: ${error.message}`);
      return;
    }
    toast.success('Contractor status updated.');
    refresh();
  };

  const handleExport = () => {
    const csv = convertToCsv(contractors);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pre_authorized_contractors.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.trim().split(/\r?\n/);
    const headers = splitCsvLine(lines.shift() ?? '');
    const records = lines.map((line) => {
      const values = splitCsvLine(line);
      return headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = values[index] ?? '';
        return acc;
      }, {});
    });

    const payload = records.map((record) => ({
      name: record.name,
      company: record.company,
      contact_number: record.contact_number || null,
      category: record.category || null,
      notes: record.notes || null,
      is_active: record.is_active ? record.is_active === 'true' : true,
      archived: record.archived ? record.archived === 'true' : false,
      known_license_plates: record.known_license_plates
        ? record.known_license_plates.split('|').filter(Boolean)
        : [],
      profile_picture_url: record.profile_picture_url || null
    }));

    const { error } = await supabase.from('pre_authorized_contractors').insert(payload);
    if (error) {
      toast.error(`Import failed: ${error.message}`);
      return;
    }
    toast.success('Contractors imported successfully.');
    event.target.value = '';
    refresh();
  };

  const selectedContractors = contractors.filter((contractor) => selectedIds.includes(contractor.id));

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white">Pre-Authorized Contractors</h2>
            <p className="text-sm text-slate-400">
              Maintain an up-to-date directory for rapid lookups during sign-in.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setManageModalOpen(true);
              }}
              className="rounded-full bg-brand-light px-3 py-2 text-sm font-semibold text-white hover:bg-brand"
            >
              Add contractor
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="rounded-full border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-brand-light"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-brand-light"
            >
              Import CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImportFile}
            />
            <button
              type="button"
              disabled={selectedIds.length < 2}
              onClick={() => setMergeModalOpen(true)}
              className="rounded-full border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              Merge selected
            </button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <input
            className="md:col-span-2"
            placeholder="Search by name, company, category..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <label className="inline-flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(event) => setShowArchived(event.target.checked)}
            />
            Show archived
          </label>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-soft">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                  onChange={(event) =>
                    setSelectedIds(event.target.checked ? filtered.map((item) => item.id) : [])
                  }
                />
              </th>
              <th className="px-4 py-3 text-left">Contractor</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  Loading directory...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  No contractors found.
                </td>
              </tr>
            ) : (
              filtered.map((contractor) => (
                <tr key={contractor.id} className="hover:bg-slate-900/70">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(contractor.id)}
                      onChange={() => toggleSelect(contractor.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{contractor.name}</div>
                    {contractor.notes && (
                      <div className="text-xs text-slate-500">{contractor.notes.slice(0, 60)}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{contractor.company}</td>
                  <td className="px-4 py-3 text-slate-300">{contractor.category || '—'}</td>
                  <td className="px-4 py-3 text-slate-300">{contractor.contact_number || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        contractor.archived
                          ? 'bg-slate-800 text-slate-400'
                          : contractor.is_active
                          ? 'bg-green-600/20 text-green-200'
                          : 'bg-yellow-600/20 text-yellow-100'
                      }`}
                    >
                      {contractor.archived ? 'Archived' : contractor.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(contractor);
                          setManageModalOpen(true);
                        }}
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-brand-light"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleActiveToggle(contractor)}
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-brand-light"
                      >
                        {contractor.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArchiveToggle(contractor)}
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-brand-light"
                      >
                        {contractor.archived ? 'Restore' : 'Archive'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ManageContractorModal
        open={manageModalOpen}
        contractor={editing}
        onClose={() => {
          setManageModalOpen(false);
          setEditing(null);
          refresh();
        }}
      />

      <MergeContractorsModal
        open={mergeModalOpen}
        contractors={selectedContractors}
        onClose={() => {
          setMergeModalOpen(false);
          setSelectedIds([]);
          refresh();
        }}
      />
    </section>
  );
}
