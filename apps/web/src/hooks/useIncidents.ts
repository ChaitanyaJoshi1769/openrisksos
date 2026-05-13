'use client';

import { useQuery } from '@tanstack/react-query';
import { Incident } from '@openrisksos/api-client';
import { useApiClient } from './useApiClient';

export interface IncidentsState {
  data: Incident[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useIncidents(): IncidentsState {
  const { client } = useApiClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      return await client.incident.getIncidents();
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
