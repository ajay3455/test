import { useCallback, useEffect, useState } from 'react';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { ContractorSignIn } from '../types';
import { useRealtimeTable } from './useRealtimeTable';

export function useContractorSignIns() {
  const [signIns, setSignIns] = useState<ContractorSignIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignIns = useCallback(async () => {
    setLoading(true);
    const { data, error: supabaseError } = await supabase
      .from('contractor_sign_ins')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(400);

    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      setSignIns(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSignIns();
  }, [fetchSignIns]);

  const handleRealtime = useCallback(
    (payload: RealtimePostgresChangesPayload<ContractorSignIn>) => {
      setSignIns((previous) => {
        if (payload.eventType === 'INSERT' && payload.new) {
          const existing = previous.find((entry) => entry.id === payload.new.id);
          if (existing) {
            return previous.map((entry) => (entry.id === payload.new.id ? payload.new : entry));
          }
          return [payload.new, ...previous];
        }
        if (payload.eventType === 'UPDATE' && payload.new) {
          return previous.map((entry) => (entry.id === payload.new.id ? payload.new : entry));
        }
        if (payload.eventType === 'DELETE' && payload.old) {
          return previous.filter((entry) => entry.id !== payload.old.id);
        }
        return previous;
      });
    },
    []
  );

  useRealtimeTable<ContractorSignIn>('contractor_sign_ins', handleRealtime);

  return { signIns, loading, error, refresh: fetchSignIns };
}
