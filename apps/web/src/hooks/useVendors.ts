'use client';

import { useCallback, useEffect, useState } from 'react';
import { Vendor } from '@openrisksos/api-client';
import { useApiClient } from './useApiClient';

export interface VendorsState {
  data: Vendor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useVendors(): VendorsState {
  const { client } = useApiClient();
  const [data, setData] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    if (!client) return;

    setLoading(true);
    setError(null);

    try {
      const vendors = await client.vendor.getVendors();
      setData(vendors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendors');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return {
    data,
    loading,
    error,
    refetch: fetchVendors,
  };
}
