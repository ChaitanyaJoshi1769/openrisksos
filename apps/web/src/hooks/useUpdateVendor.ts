'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from './useApiClient';

interface UpdateVendorPayload {
  name?: string;
  description?: string;
  industry?: string;
  location?: string;
  classification?: string;
  status?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactName?: string;
  assessmentType?: string;
}

export function useUpdateVendor(vendorId: string) {
  const { client } = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updates: UpdateVendorPayload) => {
      if (!client) throw new Error('API client not initialized');
      return await client.vendor.updateVendor(vendorId, updates);
    },
    onSuccess: () => {
      // Invalidate vendor detail and vendors list queries
      queryClient.invalidateQueries({ queryKey: ['vendors', vendorId] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });

  return {
    updateVendor: mutation.mutate,
    updateVendorAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess,
  };
}
