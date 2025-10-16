import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../../common/Modal';
import type { ContractorSignIn } from '../../../types';
import { useGuardProfile } from '../../../context/GuardProfileContext';
import { supabase } from '../../../lib/supabaseClient';

interface ApprovalModalProps {
  mode: 'approve' | 'decline' | null;
  entry: ContractorSignIn | null;
  onClose: () => void;
  onCompleted: (entry: ContractorSignIn) => void;
}

export function ApprovalModal({ mode, entry, onClose, onCompleted }: ApprovalModalProps) {
  const { profile } = useGuardProfile();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNotes(entry?.security_approval_notes ?? '');
  }, [entry?.security_approval_notes]);

  if (!mode || !entry) return null;

  const handleSubmit = async () => {
    if (mode === 'decline' && !notes.trim()) {
      toast.error('Approval notes are required when declining.');
      return;
    }

    setLoading(true);
    const payload = {
      approval_status: mode === 'approve' ? 'approved' : 'declined',
      security_approval_notes: notes.trim() || null,
      approved_by_name: profile.name || 'Security'
    };

    const { data, error } = await supabase
      .from('contractor_sign_ins')
      .update(payload)
      .eq('id', entry.id)
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast.error(`Failed to update approval: ${error.message}`);
      return;
    }

    toast.success(`Entry ${mode === 'approve' ? 'approved' : 'declined'}.`);
    onCompleted(data as ContractorSignIn);
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`${mode === 'approve' ? 'Approve' : 'Decline'} Contractor`}
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
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              mode === 'approve' ? 'bg-green-600 hover:bg-green-500' : 'bg-rose-600 hover:bg-rose-500'
            } disabled:opacity-60`}
          >
            {loading ? 'Saving...' : mode === 'approve' ? 'Approve' : 'Decline'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
          <strong className="block text-slate-100">Purpose:</strong> {entry.purpose_of_visit}
        </p>
        <textarea
          rows={4}
          placeholder={`${mode === 'approve' ? 'Optional' : 'Required'} notes for building log`}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="w-full"
        />
      </div>
    </Modal>
  );
}
