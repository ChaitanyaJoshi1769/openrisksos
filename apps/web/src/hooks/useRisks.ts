'use client';

import { useCallback, useEffect, useState } from 'react';
import { Risk, RiskFilter } from '@openrisksos/api-client';
import { useApiClient } from './useApiClient';

export interface RisksState {
  data: Risk[];
  loading: boolean;
  error: string | null;
  refetch: (filter?: RiskFilter) => Promise<void>;
}

export function useRisks(initialFilter?: RiskFilter): RisksState {
  const { client } = useApiClient();
  const [data, setData] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRisks = useCallback(
    async (filter?: RiskFilter) => {
      if (!client) return;

      setLoading(true);
      setError(null);

      try {
        const risks = await client.risk.getRisks(filter || initialFilter);
        setData(risks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch risks');
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [client, initialFilter]
  );

  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  return {
    data,
    loading,
    error,
    refetch: fetchRisks,
  };
}
