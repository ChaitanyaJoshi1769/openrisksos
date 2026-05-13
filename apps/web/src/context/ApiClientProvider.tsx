'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { OpenRiskOSClient } from '@openrisksos/api-client';

interface ApiClientContextType {
  client: OpenRiskOSClient | null;
  loading: boolean;
  error: string | null;
}

export const ApiClientContext = createContext<ApiClientContextType | undefined>(undefined);

export function ApiClientProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = React.useState<OpenRiskOSClient | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const tenantId = localStorage.getItem('tenantId');
      const authToken = localStorage.getItem('authToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

      if (!tenantId) {
        setError('No tenant ID found');
        setLoading(false);
        return;
      }

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

  return (
    <ApiClientContext.Provider value={{ client, loading, error }}>
      {children}
    </ApiClientContext.Provider>
  );
}

export function useApiContext() {
  const context = useContext(ApiClientContext);
  if (context === undefined) {
    throw new Error('useApiContext must be used within ApiClientProvider');
  }
  return context;
}
