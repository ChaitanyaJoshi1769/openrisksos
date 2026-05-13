'use client';

import { useQuery } from '@tanstack/react-query';
import { Risk, RiskFilter } from '@openrisksos/api-client';
import { useApiClient } from './useApiClient';

export interface RisksState {
  data: Risk[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRisks(initialFilter?: RiskFilter): RisksState {
  const { client } = useApiClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['risks', initialFilter],
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      return await client.risk.getRisks(initialFilter);
    },
    enabled: !!client,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data: data || [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch: async () => {
      await refetch();
    },
  };
}
