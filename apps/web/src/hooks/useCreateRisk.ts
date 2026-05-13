'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

interface CreateRiskPayload {
  title: string;
  description: string;
  category?: string;
  owner: string;
  probability: number;
  impact: number;
  mitigationStrategy?: string;
  mitigationOwner?: string;
  targetResolutionDate?: string;
}

export function useCreateRisk() {
  const { client } = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newRisk: CreateRiskPayload) => {
      if (!client) throw new Error('API client not initialized');
      return await client.risk.createRisk(newRisk);
    },
    onSuccess: () => {
      // Invalidate risks list query
      queryClient.invalidateQueries({ queryKey: ['risks'] });
    },
  });

  return {
    createRisk: mutation.mutate,
    createRiskAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess,
  };
}
