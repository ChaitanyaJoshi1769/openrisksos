'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

interface CreateVendorPayload {
  name: string;
  description?: string;
  industry?: string;
  location?: string;
  classification?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactName?: string;
}

export function useCreateVendor() {
  const { client } = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newVendor: CreateVendorPayload) => {
      if (!client) throw new Error('API client not initialized');
      return await client.vendor.createVendor(newVendor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });

  return {
    createVendor: mutation.mutate,
    createVendorAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess,
  };
}
