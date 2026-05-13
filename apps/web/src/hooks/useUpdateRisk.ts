'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

interface UpdateRiskPayload {
  title?: string;
  description?: string;
  category?: string;
  owner?: string;
  probability?: number;
  impact?: number;
  mitigationStrategy?: string;
  mitigationOwner?: string;
  status?: string;
  targetResolutionDate?: string;
}

export function useUpdateRisk(riskId: string) {
  const { client } = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updates: UpdateRiskPayload) => {
      if (!client) throw new Error('API client not initialized');
      return await client.risk.updateRisk(riskId, updates);
    },
    onSuccess: () => {
      // Invalidate risk detail and risks list queries
      queryClient.invalidateQueries({ queryKey: ['risks', riskId] });
      queryClient.invalidateQueries({ queryKey: ['risks'] });
    },
  });

  return {
    updateRisk: mutation.mutate,
    updateRiskAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess,
  };
}
