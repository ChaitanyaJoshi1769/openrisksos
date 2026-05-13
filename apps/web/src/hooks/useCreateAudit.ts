'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

interface CreateAuditPayload {
  title: string;
  scope: string;
  type: string;
  owner: string;
  riskLevel?: string;
}

export function useCreateAudit() {
  const { client } = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newAudit: CreateAuditPayload) => {
      if (!client) throw new Error('API client not initialized');
      return await client.audit.createAudit(newAudit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
    },
  });

  return {
    createAudit: mutation.mutate,
    createAuditAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess,
  };
}
