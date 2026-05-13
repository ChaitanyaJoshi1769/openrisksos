'use client';

import { useQuery } from '@tanstack/react-query';
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

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      return await client.vendor.getVendors();
    },
    enabled: !!client,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data: data || [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch: async () => {
      await refetch();
    },
  };
}
