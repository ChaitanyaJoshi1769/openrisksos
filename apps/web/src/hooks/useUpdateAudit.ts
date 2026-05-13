'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

interface UpdateAuditPayload {
  title?: string;
  scope?: string;
  type?: string;
  owner?: string;
  status?: string;
  riskLevel?: string;
}

export function useUpdateAudit(auditId: string) {
  const { client } = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updates: UpdateAuditPayload) => {
      if (!client) throw new Error('API client not initialized');
      return await client.audit.updateAudit(auditId, updates);
    },
    onSuccess: () => {
      // Invalidate audit detail and audits list queries
      queryClient.invalidateQueries({ queryKey: ['audits', auditId] });
      queryClient.invalidateQueries({ queryKey: ['audits'] });
    },
  });

  return {
    updateAudit: mutation.mutate,
    updateAuditAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess,
  };
}
