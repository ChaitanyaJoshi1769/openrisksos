'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

export function useDeleteIncident(incidentId: string) {
  const { client } = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error('API client not initialized');
      return await client.incident.deleteIncident(incidentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.removeQueries({ queryKey: ['incidents', incidentId] });
    },
  });

  return {
    deleteIncident: mutation.mutate,
    deleteIncidentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess,
  };
}
