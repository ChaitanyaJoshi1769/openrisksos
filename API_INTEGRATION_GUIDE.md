# API Integration Guide

Complete guide for integrating the OpenRiskOS API client with the frontend dashboard.

## Architecture Overview

```
Frontend Dashboard (Next.js)
    ↓
React Hooks (useRisks, useIncidents, etc.)
    ↓
API Client Library (@openrisksos/api-client)
    ↓
API Gateway (Port 3000)
    ↓
Microservices (Risk, Compliance, Incident, Audit, Vendor)
```

## Setup

### 1. Install API Client Package

The API client is already included in the web app dependencies. If you're using it in a new project:

```bash
npm install @openrisksos/api-client
```

### 2. Configure Environment

Create `.env.local` in the web app directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production:
```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

### 3. Wrap App with Provider

In your root layout or app component:

```typescript
import { ApiClientProvider } from '@/context/ApiClientProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ApiClientProvider>
          {children}
        </ApiClientProvider>
      </body>
    </html>
  );
}
```

## Using API Hooks

### Fetch Data

```typescript
'use client';

import { useRisks, useIncidents, useCompliance } from '@/hooks';

export default function Dashboard() {
  const { data: risks, loading: risksLoading, error: risksError } = useRisks();
  const { data: incidents, loading: incidentsLoading } = useIncidents();
  const { frameworks, overallScore } = useCompliance();

  if (risksLoading) return <div>Loading risks...</div>;
  if (risksError) return <div>Error: {risksError}</div>;

  return (
    <div>
      <h1>Total Risks: {risks.length}</h1>
      <h2>Compliance Score: {overallScore}%</h2>
    </div>
  );
}
```

### Refetch Data

```typescript
const { data, refetch } = useRisks({ status: 'active' });

// Refetch when needed
const handleRefresh = async () => {
  await refetch({ status: 'active', minScore: 15 });
};
```

### Using the Direct Client

```typescript
'use client';

import { useApiClient } from '@/hooks';

export default function MyComponent() {
  const { client, loading, error } = useApiClient();

  const handleCreateRisk = async () => {
    if (!client) return;

    try {
      const newRisk = await client.risk.createRisk({
        title: 'New Risk',
        riskCategory: 'cyber',
        probability: 3,
        impact: 4,
      });
      console.log('Created:', newRisk);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return <button onClick={handleCreateRisk}>Create Risk</button>;
}
```

## API Client Services

### Risk Service

```typescript
const { client } = useApiClient();

// CRUD operations
await client.risk.createRisk({ title: '...', ... });
await client.risk.getRisks({ status: 'active' });
await client.risk.getRisk(id);
await client.risk.updateRisk(id, { status: 'mitigated' });
await client.risk.deleteRisk(id);

// Special operations
await client.risk.getRiskHeatmap();
await client.risk.getRiskStats();
await client.risk.getHighRisks();
await client.risk.addMitigation(riskId, { title: '...', effectiveness: 80 });
```

### Compliance Service

```typescript
// Frameworks
await client.compliance.createFramework({ name: 'ISO 27001', type: 'ISO27001', totalControls: 114 });
await client.compliance.getFrameworks();
await client.compliance.getFramework(id);

// Controls
await client.compliance.createControl({ frameworkId: '...', title: '...' });
await client.compliance.getFrameworkControls(frameworkId);
await client.compliance.updateControlStatus(id, 'COMPLIANT');

// Evidence
await client.compliance.createEvidence({ title: '...', type: 'DOCUMENT' });
await client.compliance.getControlEvidence(controlId);

// Status
const status = await client.compliance.getComplianceStatus();
// { overallScore: 84, byFramework: {...}, nonCompliantControls: [...] }
```

### Incident Service

```typescript
// Incidents
await client.incident.createIncident({ title: '...', type: 'SECURITY', severity: 'HIGH' });
await client.incident.getIncidents({ status: 'OPEN' });
await client.incident.updateIncidentStatus(id, 'INVESTIGATING');

// Timeline
await client.incident.addTimelineEvent(incidentId, { eventType: 'ESCALATION', description: '...' });
await client.incident.getTimeline(incidentId);

// Corrective Actions
await client.incident.createCorrectiveAction(incidentId, { title: '...', type: 'IMMEDIATE', dueDate: '...' });
await client.incident.getCorrectiveActions(incidentId);
await client.incident.updateActionStatus(incidentId, actionId, 'COMPLETED');

// Analytics
const stats = await client.incident.getIncidentStats();
```

### Audit Service

```typescript
// Audits
await client.audit.createAudit({ title: '...', type: 'INTERNAL', scope: '...' });
await client.audit.getAudits();
await client.audit.updateAuditStatus(id, 'IN_PROGRESS');

// Findings
await client.audit.createFinding({ auditId, title: '...', severity: 'CRITICAL' });
await client.audit.getAuditFindings(auditId);
await client.audit.updateFindingStatus(id, 'IN_REMEDIATION');

// Evidence
await client.audit.createEvidence({ findingId, title: '...', type: 'DOCUMENT' });
await client.audit.getFindingEvidence(findingId);

// Statistics
const stats = await client.audit.getAuditStats();
```

### Vendor Service

```typescript
// Vendors
await client.vendor.createVendor({ name: '...', classification: 'CRITICAL' });
await client.vendor.getVendors();
await client.vendor.getCriticalVendors();
await client.vendor.updateVendorStatus(id, 'ACTIVE');

// Assessments
await client.vendor.createAssessment({ vendorId, type: 'SOC2_REPORT', date: '...' });
await client.vendor.getVendorAssessments(vendorId);

// Breaches
await client.vendor.reportBreach({ vendorId, title: '...', severity: 'HIGH', affectedRecords: 1000 });
await client.vendor.getVendorBreaches(vendorId);
await client.vendor.updateBreachStatus(id, 'CONTAINED');

// Analytics
const stats = await client.vendor.getVendorStats();
const vendorsNeeding = await client.vendor.getVendorsNeedingAssessment();
```

## Error Handling

```typescript
'use client';

import { useRisks } from '@/hooks';

export default function RisksPage() {
  const { data, loading, error, refetch } = useRisks();

  if (loading) return <div>Loading...</div>;

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {data.map(risk => (
        <div key={risk.id}>{risk.title}</div>
      ))}
    </div>
  );
}
```

## Authentication

### Login

```typescript
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApiClient } from '@/hooks';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const { setToken } = useApiClient();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Call your authentication API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, tenantId }),
      });

      const { token } = await response.json();

      // Save credentials
      localStorage.setItem('tenantId', tenantId);
      localStorage.setItem('authToken', token);

      // Set token in API client
      setToken(token);

      // Redirect
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <input value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="Tenant ID" />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Logout

```typescript
import { useRouter } from 'next/navigation';
import { useApiClient } from '@/hooks';

export default function LogoutButton() {
  const { clearToken } = useApiClient();
  const router = useRouter();

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('authToken');
    localStorage.removeItem('tenantId');
    router.push('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

## Updating Dashboard Pages

### Before (Mock Data)

```typescript
'use client';

import { useState } from 'react';

export default function RisksPage() {
  const [risks] = useState([
    { id: '1', title: 'Mock Risk', ... },
  ]);

  return <div>{risks.length} risks</div>;
}
```

### After (Real Data)

```typescript
'use client';

import { useRisks } from '@/hooks';

export default function RisksPage() {
  const { data: risks, loading, error } = useRisks();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{risks.length} risks</div>;
}
```

## Testing API Integration

### Unit Test Example

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useRisks } from '@/hooks';
import * as apiClient from '@openrisksos/api-client';

jest.mock('@openrisksos/api-client');

test('useRisks fetches data', async () => {
  const mockRisks = [{ id: '1', title: 'Test Risk' }];
  
  (apiClient.OpenRiskOSClient as jest.Mock).mockImplementation(() => ({
    risk: {
      getRisks: jest.fn().mockResolvedValue(mockRisks),
    },
  }));

  const { result } = renderHook(() => useRisks());

  await waitFor(() => {
    expect(result.current.data).toEqual(mockRisks);
  });
});
```

## Debugging

### Enable Request Logging

```typescript
// In API client initialization
const client = new OpenRiskOSClient({
  gatewayURL: 'http://localhost:3000',
  tenantId: 'test',
  token: 'token',
});

// Check network tab in browser DevTools
// All requests should show Authorization header
```

### Check Local Storage

```javascript
// In browser console
console.log(localStorage.getItem('authToken'));
console.log(localStorage.getItem('tenantId'));
```

### Test API Endpoint

```bash
curl -H "X-Tenant-ID: tenant-123" http://localhost:3000/health
```

## Troubleshooting

### "No tenant ID found" Error

```typescript
// Ensure tenant ID is saved before initializing client
localStorage.setItem('tenantId', 'your-tenant-id');
```

### 401 Unauthorized

```typescript
// Token might be expired or invalid
localStorage.removeItem('authToken');
// User will need to login again
```

### CORS Error

Verify API Gateway CORS configuration:
```env
CORS_ORIGIN=http://localhost:3100
```

### API Gateway Not Responding

```bash
# Check if gateway is running
curl http://localhost:3000/health

# Check if services are running
docker-compose ps
```

## Performance Tips

1. **Cache responses**: Use React Query or SWR for automatic caching
2. **Pagination**: Use skip/take parameters for large datasets
3. **Selective fields**: Request only needed fields from API
4. **Debounce**: Debounce search/filter inputs before API calls

## Next Steps

1. Update all dashboard pages to use API hooks
2. Implement real authentication flow
3. Add loading skeletons
4. Add error boundaries
5. Implement optimistic updates
6. Add response caching

## Resources

- [API Client README](packages/api-client/README.md)
- [API Gateway Documentation](services/api-gateway/README.md)
- [React Hooks Documentation](https://react.dev/reference/react/hooks)

