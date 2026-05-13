'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

export function useDeleteRisk(riskId: string) {
  const { client } = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error('API client not initialized');
      return await client.risk.deleteRisk(riskId);
    },
    onSuccess: () => {
      // Invalidate risks list query
      queryClient.invalidateQueries({ queryKey: ['risks'] });
      // Remove risk detail from cache
      queryClient.removeQueries({ queryKey: ['risks', riskId] });
    },
  });

  return {
    deleteRisk: mutation.mutate,
    deleteRiskAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess,
  };
}
