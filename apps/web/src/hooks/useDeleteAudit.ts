'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

export function useDeleteAudit(auditId: string) {
  const { client } = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error('API client not initialized');
      return await client.audit.deleteAudit(auditId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      queryClient.removeQueries({ queryKey: ['audits', auditId] });
    },
  });

  return {
    deleteAudit: mutation.mutate,
    deleteAuditAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess,
  };
}
