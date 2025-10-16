import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Modal } from '../../common/Modal';
import type { ContractorSignIn } from '../../../types';
import { supabase } from '../../../lib/supabaseClient';

interface HistoryModalProps {
  open: boolean;
  contractorId: string | null | undefined;
  contractorName: string;
  onClose: () => void;
}

export function HistoryModal({ open, contractorId, contractorName, onClose }: HistoryModalProps) {
  const [history, setHistory] = useState<ContractorSignIn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      let query = supabase.from('contractor_sign_ins').select('*');
      if (contractorId) {
        query = query.eq('pre_authorized_contractor_id', contractorId);
      } else {
        query = query.ilike('name', `%${contractorName}%`);
      }
      const { data, error } = await query.order('created_at', { ascending: false }).limit(50);
      if (error) {
        setError(error.message);
      } else {
        setHistory(data ?? []);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [open, contractorId, contractorName]);

  if (!open) return null;

  return (
    <Modal
      open
      onClose={onClose}
      title="Visit History"
      subtitle={`Last visits for ${contractorName}`}
      widthClass="max-w-2xl"
    >
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-900/60" />
          ))}
        </div>
      ) : error ? (
        <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p>
      ) : history.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-4 text-sm text-slate-400">
          No previous visits recorded.
        </p>
      ) : (
        <ul className="space-y-3">
          {history.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{dayjs(item.created_at).format('MMMM D, YYYY h:mm A')}</span>
                <span className="capitalize">{item.approval_status}</span>
              </div>
              <p className="mt-2 text-slate-100">{item.purpose_of_visit}</p>
              {item.work_status && (
                <p className="text-xs text-slate-400">Work status: {item.work_status}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
