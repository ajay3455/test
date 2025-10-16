import { useEffect, useState } from 'react';

export function useNow(intervalMs = 1000 * 30) {
  const [now, setNow] = useState(() => new Date().toISOString());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date().toISOString()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
