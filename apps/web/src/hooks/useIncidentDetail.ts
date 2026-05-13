'use client';

import { useQuery } from '@tanstack/react-query';
import { Incident } from '@openrisksos/api-client';
import { useApiClient } from './useApiClient';

export function useIncidentDetail(incidentId: string) {
  const { client } = useApiClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['incidents', incidentId],
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      return await client.incident.getIncident(incidentId);
    },
    enabled: !!client && !!incidentId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    incident: data,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch: async () => {
      await refetch();
    },
  };
}
