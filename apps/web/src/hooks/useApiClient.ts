'use client';

import { useCallback, useEffect, useState } from 'react';
import { OpenRiskOSClient } from '@openrisksos/api-client';

export function useApiClient() {
  const [client, setClient] = useState<OpenRiskOSClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Get credentials from localStorage
      const tenantId = localStorage.getItem('tenantId');
      const authToken = localStorage.getItem('authToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

      if (!tenantId) {
        setError('No tenant ID found');
        setLoading(false);
        return;
      }

      // Initialize client
      const newClient = new OpenRiskOSClient({
        gatewayURL: apiUrl,
        tenantId,
        token: authToken || undefined,
      });

      setClient(newClient);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize API client');
    } finally {
      setLoading(false);
    }
  }, []);

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
