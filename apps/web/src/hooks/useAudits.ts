'use client';

import { useQuery } from '@tanstack/react-query';
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

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['audits'],
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      return await client.audit.getAudits();
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
