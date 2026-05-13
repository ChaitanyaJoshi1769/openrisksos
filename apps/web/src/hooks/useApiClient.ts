'use client';

import { useContext, useCallback } from 'react';
import { ApiClientContext } from '@/context/ApiClientProvider';

export function useApiClient() {
  const context = useContext(ApiClientContext);

  if (context === undefined) {
    throw new Error('useApiClient must be used within ApiClientProvider');
  }

  const { client, loading, error } = context;

  const setToken = useCallback(
    (token: string) => {
      if (client) {
        client.setToken(token);
        localStorage.setItem('authToken', token);
      }
    },
    [client]
  );

  const clearToken = useCallback(() => {
    if (client) {
      client.clearToken();
      localStorage.removeItem('authToken');
    }
  }, [client]);

  return {
    client,
    loading,
    error,
    setToken,
    clearToken,
  };
}
