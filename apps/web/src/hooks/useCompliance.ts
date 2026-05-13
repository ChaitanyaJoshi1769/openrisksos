'use client';

import { useQuery } from '@tanstack/react-query';
import { ComplianceFramework } from '@openrisksos/api-client';
import { useApiClient } from './useApiClient';

export interface ComplianceState {
  frameworks: ComplianceFramework[];
  overallScore: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCompliance(): ComplianceState {
  const { client } = useApiClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['compliance'],
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');

      const [frameworks, status] = await Promise.all([
        client.compliance.getFrameworks(),
        client.compliance.getComplianceStatus(),
      ]);

      return {
        frameworks,
        overallScore: status.overallScore,
      };
    },
    enabled: !!client,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    frameworks: data?.frameworks || [],
    overallScore: data?.overallScore || 0,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch: async () => {
      await refetch();
    },
  };
}
