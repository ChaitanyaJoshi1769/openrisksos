'use client';

import { useQuery } from '@tanstack/react-query';
import { Audit } from '@openrisksos/api-client';
import { useApiClient } from './useApiClient';

export function useAuditDetail(auditId: string) {
  const { client } = useApiClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['audits', auditId],
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      return await client.audit.getAudit(auditId);
    },
    enabled: !!client && !!auditId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    audit: data,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch: async () => {
      await refetch();
    },
  };
}
