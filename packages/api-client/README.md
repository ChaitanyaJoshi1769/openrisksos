# OpenRiskOS API Client

TypeScript/JavaScript API client library for OpenRiskOS microservices. Provides type-safe access to all GRC platform APIs.

## Installation

```bash
npm install @openrisksos/api-client
```

## Quick Start

```typescript
import { OpenRiskOSClient } from '@openrisksos/api-client';

// Create client
const client = new OpenRiskOSClient({
  gatewayURL: 'http://localhost:3000',
  tenantId: 'tenant-123',
  token: 'jwt-token-here'
});

// Use services
const risks = await client.risk.getRisks();
const incidents = await client.incident.getOpenIncidents();
const frameworks = await client.compliance.getFrameworks();
const audits = await client.audit.getAudits();
const vendors = await client.vendor.getVendors();
```

## Services

### Risk Service

```typescript
// Create risk
const risk = await client.risk.createRisk({
  title: 'Data Breach Risk',
  riskCategory: 'cyber',
  probability: 3,
  impact: 5
});

// Get risks
const risks = await client.risk.getRisks({
  status: 'active',
  minScore: 15,
  take: 10
});

// Update risk
await client.risk.updateRisk(riskId, {
  status: 'mitigated',
  mitigationEffectiveness: 60
});

// Get heatmap
const heatmap = await client.risk.getRiskHeatmap();

// Add mitigation
await client.risk.addMitigation(riskId, {
  title: 'Implement MFA',
  effectiveness: 80
});
```

### Compliance Service

```typescript
// Create framework
const framework = await client.compliance.createFramework({
  name: 'ISO 27001',
  type: 'ISO27001',
  totalControls: 114
});

// Get frameworks
const frameworks = await client.compliance.getFrameworks();

// Create control
const control = await client.compliance.createControl({
  frameworkId: framework.id,
  title: 'Access Control',
  status: 'IN_PROGRESS'
});

// Add evidence
const evidence = await client.compliance.createEvidence({
  title: 'Security Policy',
  type: 'DOCUMENT',
  url: 'https://example.com/policy'
});

// Get compliance status
const status = await client.compliance.getComplianceStatus();
// { overallScore: 84, byFramework: {...}, nonCompliantControls: [...] }
```

### Incident Service

```typescript
// Create incident
const incident = await client.incident.createIncident({
  title: 'Unauthorized Access',
  type: 'SECURITY',
  severity: 'HIGH',
  affectedRecords: 100
});

// Get incidents
const openIncidents = await client.incident.getOpenIncidents();
const criticalIncidents = await client.incident.getCriticalIncidents();

// Add timeline event
await client.incident.addTimelineEvent(incidentId, {
  eventType: 'ESCALATION',
  description: 'Escalated to CISO'
});

// Create corrective action
await client.incident.createCorrectiveAction(incidentId, {
  title: 'Disable compromised account',
  type: 'IMMEDIATE',
  dueDate: new Date().toISOString(),
  assignedTo: 'security-team'
});

// Get statistics
const stats = await client.incident.getIncidentStats();
```

### Audit Service

```typescript
// Create audit
const audit = await client.audit.createAudit({
  title: 'Annual IT Audit',
  type: 'INTERNAL',
  scope: 'Infrastructure',
  scheduledDate: new Date().toISOString(),
  assignedTo: 'auditor@example.com'
});

// Get audits
const audits = await client.audit.getAudits({ status: 'IN_PROGRESS' });

// Create finding
const finding = await client.audit.createFinding({
  auditId: audit.id,
  title: 'Missing encryption',
  severity: 'CRITICAL',
  dueDate: new Date().toISOString()
});

// Add evidence
await client.audit.createEvidence({
  findingId: finding.id,
  title: 'Encryption scan results',
  type: 'DOCUMENT'
});

// Get statistics
const stats = await client.audit.getAuditStats();
```

### Vendor Service

```typescript
// Create vendor
const vendor = await client.vendor.createVendor({
  name: 'CloudSecure Inc',
  classification: 'CRITICAL',
  manager: 'vendor-manager@example.com'
});

// Get vendors
const criticalVendors = await client.vendor.getCriticalVendors();
const vendorsNeedingReview = await client.vendor.getVendorsNeedingAssessment();

// Create assessment
const assessment = await client.vendor.createAssessment({
  vendorId: vendor.id,
  type: 'SOC2_REPORT',
  date: new Date().toISOString(),
  assessor: 'auditor@example.com'
});

// Report breach
const breach = await client.vendor.reportBreach({
  vendorId: vendor.id,
  title: 'Data exposure',
  severity: 'HIGH',
  affectedRecords: 5000
});

// Get statistics
const stats = await client.vendor.getVendorStats();
```

## Authentication

### Setting Token

```typescript
// Set token after login
client.setToken('new-jwt-token');

// Clear token on logout
client.clearToken();
```

### Multi-Tenant Support

```typescript
// Switch tenant context
client.setTenantId('new-tenant-id');

// All subsequent requests use new tenant
const risks = await client.risk.getRisks();
```

## Error Handling

```typescript
import { OpenRiskOSClient } from '@openrisksos/api-client';

try {
  const risk = await client.risk.getRisk('invalid-id');
} catch (error: any) {
  console.error('Error:', error.message);
  console.error('Status:', error.statusCode);
  console.error('Validation errors:', error.errors);
}
```

## Using Individual Services

```typescript
import { RiskService } from '@openrisksos/api-client';

const riskService = new RiskService(
  'http://localhost:3001',
  'tenant-123',
  'jwt-token'
);

const risks = await riskService.getRisks();
```

## TypeScript Support

All services are fully typed:

```typescript
import type {
  Risk,
  CreateRiskDto,
  Incident,
  CreateIncidentDto,
  ComplianceFramework,
  CreateFrameworkDto,
  // ... and more
} from '@openrisksos/api-client';

const newRisk: CreateRiskDto = {
  title: 'Risk Title',
  riskCategory: 'cyber',
  probability: 3,
  impact: 5
};

const risk: Risk = await client.risk.createRisk(newRisk);
```

## Usage in React

```typescript
import { useEffect, useState } from 'react';
import { OpenRiskOSClient, Risk } from '@openrisksos/api-client';

function RiskList() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = new OpenRiskOSClient({
      gatewayURL: process.env.REACT_APP_API_URL,
      tenantId: localStorage.getItem('tenantId') || '',
      token: localStorage.getItem('authToken') || ''
    });

    client.risk.getRisks().then(setRisks).finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{risks.map(r => <div key={r.id}>{r.title}</div>)}</div>;
}
```

## Configuration

### BaseURL Options

```typescript
// Gateway (recommended)
const client = new OpenRiskOSClient({
  gatewayURL: 'http://localhost:3000',
  tenantId: 'tenant-123'
});

// Direct to service
const riskService = new RiskService(
  'http://localhost:3001',
  'tenant-123'
);
```

### Timeout Configuration

Services default to 30s timeout. Modify in config:

```typescript
const riskService = new RiskService(
  'http://localhost:3001',
  'tenant-123',
  'token'
);
// Timeout is configurable in BaseApiClient
```

## API Response Format

All successful responses return typed data. Error responses follow consistent format:

```typescript
// Success
{
  data: { id: '...', title: '...', ... }
}

// Error
{
  statusCode: 400,
  message: 'Validation failed',
  errors: {
    title: ['Title is required'],
    probability: ['Must be 1-5']
  },
  timestamp: '2026-05-13T...',
  path: '/api/v1/risks'
}
```

## Building from Source

```bash
npm install
npm run build
npm run typecheck
npm run lint
```

## Testing

Services are designed to work with mock implementations:

```typescript
import { RiskService } from '@openrisksos/api-client';

// Mock implementation for testing
class MockRiskService extends RiskService {
  async getRisks() {
    return [
      {
        id: '1',
        title: 'Test Risk',
        // ... mock data
      }
    ];
  }
}
```

## API Documentation

For detailed API documentation, see:
- Risk Service: [services/risk-service/README.md](../../services/risk-service/README.md)
- Compliance Service: [services/compliance-service/README.md](../../services/compliance-service/README.md)
- Incident Service: [services/incident-service/README.md](../../services/incident-service/README.md)
- Audit Service: [services/audit-service/README.md](../../services/audit-service/README.md)
- Vendor Service: [services/vendor-service/README.md](../../services/vendor-service/README.md)

## License

Part of OpenRiskOS - Enterprise GRC Platform
