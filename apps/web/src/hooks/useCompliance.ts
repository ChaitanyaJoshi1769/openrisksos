'use client';

import { useCallback, useEffect, useState } from 'react';
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
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompliance = useCallback(async () => {
    if (!client) return;

    setLoading(true);
    setError(null);

    try {
      const fwks = await client.compliance.getFrameworks();
      setFrameworks(fwks);

      const status = await client.compliance.getComplianceStatus();
      setOverallScore(status.overallScore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch compliance data');
      setFrameworks([]);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchCompliance();
  }, [fetchCompliance]);

  return {
    frameworks,
    overallScore,
    loading,
    error,
    refetch: fetchCompliance,
  };
}
