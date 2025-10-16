import { useCallback, useEffect, useState } from 'react';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { PreAuthorizedContractor } from '../types';
import { useRealtimeTable } from './useRealtimeTable';

export function usePreAuthorizedContractors() {
  const [contractors, setContractors] = useState<PreAuthorizedContractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContractors = useCallback(async () => {
    setLoading(true);
    const { data, error: supabaseError } = await supabase
      .from('pre_authorized_contractors')
      .select('*')
      .order('name');

    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      setContractors(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContractors();
  }, [fetchContractors]);

  const handleRealtime = useCallback(
    (payload: RealtimePostgresChangesPayload<PreAuthorizedContractor>) => {
      setContractors((previous) => {
        if (payload.eventType === 'INSERT' && payload.new) {
          const existing = previous.find((entry) => entry.id === payload.new.id);
          if (existing) {
            return previous.map((entry) => (entry.id === payload.new.id ? payload.new : entry));
          }
          return [...previous, payload.new].sort((a, b) => a.name.localeCompare(b.name));
        }
        if (payload.eventType === 'UPDATE' && payload.new) {
          return previous
            .map((entry) => (entry.id === payload.new.id ? payload.new : entry))
            .sort((a, b) => a.name.localeCompare(b.name));
        }
        if (payload.eventType === 'DELETE' && payload.old) {
          return previous.filter((entry) => entry.id !== payload.old.id);
        }
        return previous;
      });
    },
    []
  );

  useRealtimeTable<PreAuthorizedContractor>('pre_authorized_contractors', handleRealtime);

  return { contractors, loading, error, refresh: fetchContractors };
}
