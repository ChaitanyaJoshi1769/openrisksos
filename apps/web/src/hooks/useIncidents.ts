'use client';

import { useCallback, useEffect, useState } from 'react';
import { Incident } from '@openrisksos/api-client';
import { useApiClient } from './useApiClient';

export interface IncidentsState {
  data: Incident[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useIncidents(): IncidentsState {
  const { client } = useApiClient();
  const [data, setData] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    if (!client) return;

    setLoading(true);
    setError(null);

    try {
      const incidents = await client.incident.getIncidents();
      setData(incidents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch incidents');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return {
    data,
    loading,
    error,
    refetch: fetchIncidents,
  };
}
