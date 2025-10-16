import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../../common/Modal';
import type { ContractorSignIn } from '../../../types';
import { useGuardProfile } from '../../../context/GuardProfileContext';
import { supabase } from '../../../lib/supabaseClient';

interface SignOutModalProps {
  open: boolean;
  entry: ContractorSignIn | null;
  onClose: () => void;
  onCompleted: (entry: ContractorSignIn) => void;
}

const WORK_STATUS_OPTIONS = [
  { value: 'work_completed', label: 'Work Completed' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'will_return', label: 'Will Return' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'not_applicable', label: 'Not Applicable' }
];

type SignOutForm = {
  workStatus: string;
  workDetails: string;
  keysReturned: boolean;
  keysNotReturnedReason: string;
  securityNotes: string;
};

const EMPTY_FORM: SignOutForm = {
  workStatus: 'work_completed',
  workDetails: '',
  keysReturned: true,
  keysNotReturnedReason: '',
  securityNotes: ''
};

export function SignOutModal({ open, entry, onClose, onCompleted }: SignOutModalProps) {
  const { profile } = useGuardProfile();
  const [form, setForm] = useState<SignOutForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
    }
  }, [open, entry?.id]);

  if (!open || !entry) return null;

  const validate = () => {
    if (!form.workStatus) {
      toast.error('Select a work status.');
      return false;
    }
    if (entry.keys && entry.keys.length > 0 && !form.keysReturned && !form.keysNotReturnedReason.trim()) {
      toast.error('Provide a reason for missing keys.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    const now = new Date().toISOString();
    const payload = {
      is_signed_out: true,
      sign_out_time: now,
      work_status: form.workStatus,
      work_details: form.workDetails.trim() || null,
      keys_returned: entry.keys && entry.keys.length > 0 ? form.keysReturned : null,
      keys_not_returned_reason:
        entry.keys && entry.keys.length > 0 && !form.keysReturned
          ? form.keysNotReturnedReason.trim()
          : null,
      security_sign_out_notes: form.securityNotes.trim() || null,
      signed_out_by_name: profile.name || 'Security'
    };

    const { data, error } = await supabase
      .from('contractor_sign_ins')
      .update(payload)
      .eq('id', entry.id)
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast.error(`Failed to sign out: ${error.message}`);
      return;
    }

    toast.success('Contractor signed out.');
    onCompleted(data as ContractorSignIn);
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Sign Out Contractor"
      subtitle={`${entry.name} • ${entry.company}`}
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
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-xl bg-brand-light px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Confirm Sign-Out'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-slate-500">Work Status *</label>
          <select
            value={form.workStatus}
            onChange={(event) => setForm((previous) => ({ ...previous, workStatus: event.target.value }))}
          >
            {WORK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-slate-500">Work Details</label>
          <textarea
            rows={3}
            value={form.workDetails}
            onChange={(event) => setForm((previous) => ({ ...previous, workDetails: event.target.value }))}
          />
        </div>
        {entry.keys && entry.keys.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-500">Were all keys returned?</label>
            <div className="flex gap-2">
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() => setForm((previous) => ({ ...previous, keysReturned: value }))}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
                    form.keysReturned === value
                      ? 'border-brand-light bg-brand-light/20 text-brand-muted'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-brand-light'
                  }`}
                >
                  {value ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
            {!form.keysReturned && (
              <textarea
                rows={2}
                placeholder="Reason keys not returned"
                value={form.keysNotReturnedReason}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, keysNotReturnedReason: event.target.value }))
                }
              />
            )}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-slate-500">Security Sign-Out Notes</label>
          <textarea
            rows={3}
            value={form.securityNotes}
            onChange={(event) => setForm((previous) => ({ ...previous, securityNotes: event.target.value }))}
          />
        </div>
      </div>
    </Modal>
  );
}
