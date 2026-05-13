'use client';

import { useQuery } from '@tanstack/react-query';
import { Vendor } from '@openrisksos/api-client';
import { useApiClient } from './useApiClient';

export function useVendorDetail(vendorId: string) {
  const { client } = useApiClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['vendors', vendorId],
    queryFn: async () => {
      if (!client) throw new Error('API client not initialized');
      return await client.vendor.getVendor(vendorId);
    },
    enabled: !!client && !!vendorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    vendor: data,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch: async () => {
      await refetch();
    },
  };
}
