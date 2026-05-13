'use client';

import { useQuery } from '@tanstack/react-query';
import { Risk } from '@openrisksos/api-client';
import { useApiClient } from './useApiClient';

export function useRiskDetail(riskId: string) {
  const { client } = useApiClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['risks', riskId],
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      return await client.risk.getRisk(riskId);
    },
    enabled: !!client && !!riskId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    risk: data,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch: async () => {
      await refetch();
    },
  };
}
