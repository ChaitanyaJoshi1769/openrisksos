'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

interface UpdateIncidentPayload {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  assignedTo?: string;
  affectedRecords?: number;
  systemsImpacted?: string[];
}

export function useUpdateIncident(incidentId: string) {
  const { client } = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updates: UpdateIncidentPayload) => {
      if (!client) throw new Error('API client not initialized');
      return await client.incident.updateIncident(incidentId, updates);
    },
    onSuccess: () => {
      // Invalidate incident detail and incidents list queries
      queryClient.invalidateQueries({ queryKey: ['incidents', incidentId] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });

  return {
    updateIncident: mutation.mutate,
    updateIncidentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess,
  };
}
