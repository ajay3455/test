import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../common/Modal';
import type { PreAuthorizedContractor } from '../../types';
import { supabase } from '../../lib/supabaseClient';

interface MergeContractorsModalProps {
  open: boolean;
  contractors: PreAuthorizedContractor[];
  onClose: () => void;
}

export function MergeContractorsModal({ open, contractors, onClose }: MergeContractorsModalProps) {
  const [primaryId, setPrimaryId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && contractors.length > 0) {
      setPrimaryId(contractors[0].id);
    }
  }, [open, contractors]);

  const secondary = useMemo(
    () => contractors.filter((contractor) => contractor.id !== primaryId),
    [contractors, primaryId]
  );

  if (!open) return null;

  const handleMerge = async () => {
    if (!primaryId) {
      toast.error('Select a primary contractor.');
      return;
    }
    if (secondary.length === 0) {
      toast.error('Select at least two contractors to merge.');
      return;
    }

    setLoading(true);
    const primary = contractors.find((item) => item.id === primaryId)!;
    const combinedPlates = Array.from(
      new Set(contractors.flatMap((item) => item.known_license_plates ?? []))
    );
    const combinedNotes = [primary.notes, ...secondary.map((item) => item.notes)]
      .filter(Boolean)
      .join('\n---\n');

    const { error: updateError } = await supabase
      .from('pre_authorized_contractors')
      .update({
        known_license_plates: combinedPlates,
        notes: combinedNotes || null
      })
      .eq('id', primaryId);

    if (updateError) {
      toast.error(`Failed to update primary contractor: ${updateError.message}`);
      setLoading(false);
      return;
    }

    if (secondary.length > 0) {
      const secondaryIds = secondary.map((item) => item.id);
      const { error: reassignError } = await supabase
        .from('contractor_sign_ins')
        .update({ pre_authorized_contractor_id: primaryId })
        .in('pre_authorized_contractor_id', secondaryIds);
      if (reassignError) {
        toast.error(`Failed to reassign sign-ins: ${reassignError.message}`);
        setLoading(false);
        return;
      }

      await supabase
        .from('pre_authorized_contractors')
        .update({ archived: true, is_active: false })
        .in('id', secondaryIds);
    }

    setLoading(false);
    toast.success('Contractors merged successfully.');
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Merge Contractors"
      subtitle="Select the primary profile to keep and merge others into it."
      widthClass="max-w-3xl"
      footer={
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleMerge}
            disabled={loading}
            className="flex-1 rounded-xl bg-brand-light px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand disabled:opacity-60"
          >
            {loading ? 'Merging...' : 'Merge selected'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4 text-xs text-yellow-100">
          All sign-in history from duplicate contractors will be reassigned to the primary record.
        </p>
        <ul className="space-y-3">
          {contractors.map((contractor) => (
            <li
              key={contractor.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <input
                type="radio"
                name="primary"
                checked={contractor.id === primaryId}
                onChange={() => setPrimaryId(contractor.id)}
              />
              <div>
                <p className="text-sm font-semibold text-white">{contractor.name}</p>
                <p className="text-xs text-slate-400">{contractor.company}</p>
                {contractor.known_license_plates && contractor.known_license_plates.length > 0 && (
                  <p className="text-xs text-slate-500">
                    Plates: {contractor.known_license_plates.join(', ')}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
