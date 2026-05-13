'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

export function useDeleteVendor(vendorId: string) {
  const { client } = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error('API client not initialized');
      return await client.vendor.deleteVendor(vendorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.removeQueries({ queryKey: ['vendors', vendorId] });
    },
  });

  return {
    deleteVendor: mutation.mutate,
    deleteVendorAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess,
  };
}
