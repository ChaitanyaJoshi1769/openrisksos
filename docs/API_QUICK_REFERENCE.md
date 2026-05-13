# OpenRiskOS API Quick Reference

Quick reference for the OpenRiskOS REST and GraphQL APIs.

## Base URLs

```
REST API:    http://localhost:3001/api/v1
GraphQL:     http://localhost:3001/graphql
Keycloak:    http://localhost:8080/auth
```

## Authentication

All requests require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

### Get Token (OAuth2)

```bash
curl -X POST http://localhost:8080/auth/realms/master/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=admin-cli&client_secret=<secret>&username=user&password=pass&grant_type=password"
```

## Risk Management API

### Get All Risks

```http
GET /api/v1/risks?status=active&limit=50&offset=0
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

Response:
```json
[
  {
    "id": "risk-123",
    "title": "Data Breach Risk",
    "riskCategory": "cyber",
    "probability": 3,
    "inherentImpact": 4,
    "inherentScore": 12,
    "residualScore": 4,
    "status": "active",
    "ownerId": "user-123",
    "createdAt": "2026-05-13T10:00:00Z"
  }
]
```

### Create Risk

```http
POST /api/v1/risks
Content-Type: application/json
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>

{
  "title": "Data Breach Risk",
  "description": "Unauthorized access to customer data",
  "riskCategory": "cyber",
  "probability": 3,
  "inherentImpact": 4,
  "ownerId": "user-123",
  "businessUnit": "IT"
}
```

### Get Risk by ID

```http
GET /api/v1/risks/risk-123
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

### Update Risk

```http
PUT /api/v1/risks/risk-123
Content-Type: application/json
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>

{
  "probability": 4,
  "residualScore": 6
}
```

### Delete Risk (Soft Delete)

```http
DELETE /api/v1/risks/risk-123
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

### Get Risk Heatmap

```http
GET /api/v1/risks/heatmap
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

Response (5x5 matrix):
```json
{
  "matrix": [
    [0, 1, 2, 1, 0],
    [1, 2, 3, 2, 1],
    [2, 3, 5, 3, 2],
    [1, 2, 3, 2, 1],
    [0, 1, 2, 1, 0]
  ]
}
```

### Calculate Residual Score

```http
POST /api/v1/risks/risk-123/calculate-residual
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

---

## Compliance Management API

### Get Compliance Frameworks

```http
GET /api/v1/compliance/frameworks
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

### Get Controls for Framework

```http
GET /api/v1/compliance/controls?frameworkId=iso27001
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

### Get Control Details

```http
GET /api/v1/compliance/controls/control-123
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

### Upload Evidence

```http
POST /api/v1/compliance/controls/control-123/evidence
Content-Type: multipart/form-data
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>

[file upload]
```

### Get Evidence for Control

```http
GET /api/v1/compliance/controls/control-123/evidence
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

---

## Incident Management API

### Get All Incidents

```http
GET /api/v1/incidents?status=open&severity=critical&limit=50
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

### Create Incident

```http
POST /api/v1/incidents
Content-Type: application/json
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>

{
  "title": "Data Exfiltration",
  "description": "Unauthorized data transfer detected",
  "type": "cyber",
  "severity": "critical",
  "affectedSystems": ["production-db", "api-server"],
  "affectedUsers": 1000,
  "dataExposed": true
}
```

### Get Incident Details

```http
GET /api/v1/incidents/incident-123
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

### Update Incident

```http
PUT /api/v1/incidents/incident-123
Content-Type: application/json
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>

{
  "status": "contained",
  "rootCause": "Misconfigured IAM policy"
}
```

### Add Investigation Timeline

```http
POST /api/v1/incidents/incident-123/timeline
Content-Type: application/json
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>

{
  "timestamp": "2026-05-13T10:15:00Z",
  "event": "Breach contained",
  "investigator": "user-123",
  "evidence": ["log-file-1.txt", "screenshot.png"]
}
```

### Create CAPA Action

```http
POST /api/v1/incidents/incident-123/capa
Content-Type: application/json
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>

{
  "title": "Fix IAM policy",
  "description": "Restrict access to production database",
  "status": "open",
  "owner": "user-456",
  "targetDate": "2026-05-20"
}
```

---

## Vendor Management API

### Get All Vendors

```http
GET /api/v1/vendors?status=active
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

### Create Vendor

```http
POST /api/v1/vendors
Content-Type: application/json
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>

{
  "name": "Cloud Provider Inc",
  "type": "Cloud",
  "description": "SaaS application platform",
  "contractedServices": ["hosting", "backup"],
  "dataClassification": "Confidential"
}
```

### Get Vendor Details

```http
GET /api/v1/vendors/vendor-123
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

---

## Audit Management API

### Get All Audits

```http
GET /api/v1/audits?status=in_progress
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

### Create Audit

```http
POST /api/v1/audits
Content-Type: application/json
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>

{
  "title": "SOC2 Compliance Audit",
  "type": "compliance",
  "scope": "IT Operations",
  "planner": "user-123",
  "plannedStart": "2026-06-01",
  "plannedEnd": "2026-06-30"
}
```

### Get Audit Details

```http
GET /api/v1/audits/audit-123
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

### Add Audit Finding

```http
POST /api/v1/audits/audit-123/findings
Content-Type: application/json
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>

{
  "title": "Missing access controls",
  "description": "Database access not restricted by role",
  "severity": "high",
  "status": "open",
  "dueDate": "2026-06-30"
}
```

---

## Analytics API

### Get Risk Metrics

```http
GET /api/v1/analytics/risks?period=month
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

### Get Compliance Status

```http
GET /api/v1/analytics/compliance-status
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

Response:
```json
{
  "frameworks": [
    {
      "name": "ISO27001",
      "compliantControls": 45,
      "totalControls": 100,
      "compliancePercentage": 45
    },
    {
      "name": "SOC2",
      "compliantControls": 18,
      "totalControls": 22,
      "compliancePercentage": 82
    }
  ]
}
```

### Get Incident Analytics

```http
GET /api/v1/analytics/incidents?period=month
Authorization: Bearer <token>
X-Tenant-ID: <tenant-id>
```

---

## GraphQL Examples

### Get Risks with GraphQL

```graphql
query GetRisks($filter: RiskFilterInput) {
  risks(filter: $filter) {
    id
    title
    probability
    inherentImpact
    inherentScore
    owner {
      id
      name
    }
    mitigations {
      id
      title
      effectiveness
    }
  }
}
```

### Create Risk with GraphQL

```graphql
mutation CreateRisk($input: CreateRiskInput!) {
  createRisk(input: $input) {
    id
    title
    inherentScore
    status
    createdAt
  }
}

# Variables
{
  "input": {
    "title": "New Risk",
    "riskCategory": "operational",
    "probability": 3,
    "inherentImpact": 4,
    "ownerId": "user-123"
  }
}
```

### Get Compliance Status with GraphQL

```graphql
query GetComplianceStatus {
  complianceStatus {
    frameworkName
    compliantControls
    totalControls
    compliancePercentage
  }
}
```

---

## Response Format

### Success Response

```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2026-05-13T10:00:00Z",
    "version": "1.0"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid risk probability",
    "details": {
      "probability": "Must be between 1 and 5"
    }
  },
  "meta": {
    "timestamp": "2026-05-13T10:00:00Z"
  }
}
```

---

## Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

---

## Rate Limiting

All API endpoints are rate limited to **100 requests per minute** per API key.

```
Rate-Limit-Limit: 100
Rate-Limit-Remaining: 45
Rate-Limit-Reset: 1684070460
```

---

## Pagination

List endpoints support pagination:

```
GET /api/v1/risks?limit=50&offset=0&sortBy=createdAt&sortOrder=desc
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "total": 1234,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## Filtering & Sorting

Supported query parameters:

```
?status=active
?riskCategory=cyber
?severity=critical
?ownerId=user-123
?sortBy=createdAt
?sortOrder=asc|desc
?limit=50
?offset=0
```

---

## Webhooks

Register webhooks for real-time events:

```bash
POST /api/v1/webhooks
{
  "url": "https://your-service.com/webhook",
  "events": ["risk.created", "incident.updated"],
  "active": true
}
```

Webhook payload:
```json
{
  "event": "risk.created",
  "timestamp": "2026-05-13T10:00:00Z",
  "data": { ... }
}
```

---

## SDK Usage

### TypeScript/JavaScript

```typescript
import { OpenRiskOSClient } from '@openrisksos/api-client';

const client = new OpenRiskOSClient({
  apiUrl: 'http://localhost:3001',
  token: 'your-jwt-token'
});

// Get risks
const risks = await client.getRisks('tenant-123');

// Create risk
const newRisk = await client.createRisk('tenant-123', {
  title: 'New Risk',
  riskCategory: 'cyber',
  probability: 3,
  inherentImpact: 4,
  ownerId: 'user-123'
});

// Update risk
await client.updateRisk('tenant-123', 'risk-123', {
  probability: 4
});
```

---

For full API documentation, see [API Documentation](./API.md) or visit https://docs.openrisks.io/api
