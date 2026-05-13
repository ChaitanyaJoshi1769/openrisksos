'use client';

import { useCallback, useEffect, useState } from 'react';
import { Audit } from '@openrisksos/api-client';
import { useApiClient } from './useApiClient';

export interface AuditsState {
  data: Audit[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAudits(): AuditsState {
  const { client } = useApiClient();
  const [data, setData] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudits = useCallback(async () => {
    if (!client) return;

    setLoading(true);
    setError(null);

    try {
      const audits = await client.audit.getAudits();
      setData(audits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audits');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  return {
    data,
    loading,
    error,
    refetch: fetchAudits,
  };
}
