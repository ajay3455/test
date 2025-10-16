import { useEffect } from 'react';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export function useRealtimeTable<T>(
  table: string,
  handler: (payload: RealtimePostgresChangesPayload<T>) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel(`table:${table}`)
      .on<T>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table
        },
        (payload) => handler(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, handler]);
}
