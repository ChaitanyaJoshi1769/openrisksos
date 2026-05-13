'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

interface CreateIncidentPayload {
  title: string;
  description: string;
  type: string;
  assignedTo?: string;
  affectedRecords?: number;
  systemsImpacted?: string[];
}

export function useCreateIncident() {
  const { client } = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newIncident: CreateIncidentPayload) => {
      if (!client) throw new Error('API client not initialized');
      return await client.incident.createIncident(newIncident);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });

  return {
    createIncident: mutation.mutate,
    createIncidentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess,
  };
}
