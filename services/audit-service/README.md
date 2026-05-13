# Audit Service

**Enterprise Audit Management Microservice** for OpenRiskOS.

This service handles audit planning, execution, finding management, and evidence collection for internal and external audits.

## Features

- **Audit Management:** Plan, schedule, execute, and close audits
- **Audit Types:** Internal, External, Compliance, IT, Operational, Financial, Special
- **Finding Management:** Track audit findings with severity and status
- **Evidence Collection:** Collect and organize audit evidence by type
- **Finding Status Tracking:** OPEN → IN_REMEDIATION → REMEDIATED → CLOSED
- **Audit Analytics:** Statistics by type, status, and finding severity
- **Multi-tenant:** Complete isolation between tenants
- **GraphQL & REST:** Both API styles supported
- **Validation:** Comprehensive input validation
- **Error Handling:** Global error handling and logging

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** NestJS 10.3+
- **Language:** TypeScript 5.3+
- **Database:** PostgreSQL 16+ (via Prisma)
- **API:** REST + GraphQL
- **Testing:** Jest 29.7+
- **GraphQL:** Apollo Server, @nestjs/graphql

## Setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 16+
- Redis (for caching)

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env

# Run database migrations
pnpm db:migrate

# Generate Prisma client
pnpm generate
```

### Development

```bash
# Start in watch mode
pnpm dev

# Run tests
pnpm test

# Watch tests
pnpm test:watch

# Coverage
pnpm test:coverage

# Lint
pnpm lint
```

### Production

```bash
# Build
pnpm build

# Start
pnpm start
```

## API Endpoints

### REST API (`/api/v1/audits`)

#### Audits

- `POST /` - Create audit
- `GET /` - List audits (with filtering, pagination)
- `GET /:id` - Get audit details
- `PUT /:id` - Update audit
- `PUT /:id/status` - Update audit status
- `DELETE /:id` - Delete audit (soft)

#### Findings

- `POST /:auditId/findings` - Create finding
- `GET /:auditId/findings` - Get audit findings
- `GET /findings/:id` - Get finding details
- `PUT /findings/:id` - Update finding
- `PUT /findings/:id/status` - Update finding status
- `DELETE /findings/:id` - Delete finding

#### Evidence

- `POST /evidence` - Create evidence
- `GET /findings/:findingId/evidence` - Get evidence for finding
- `DELETE /evidence/:id` - Delete evidence

#### Analytics

- `GET /analytics/audits` - Get audit statistics
- `GET /analytics/findings` - Get finding statistics
- `GET /analytics/open-findings` - Get open findings

### GraphQL (`/graphql`)

```graphql
query GetAudits {
  audits(tenantId: "tenant-123") {
    data {
      id
      title
      type
      status
      findings { title severity status }
    }
  }
}

query GetAuditStats {
  auditStats(tenantId: "tenant-123") {
    total
    byStatus { planned in_progress report_issued closed }
    byType { internal external compliance it }
    inProgressCount completedCount
  }
}

mutation CreateAudit($tenantId: String!, $input: CreateAuditInput!) {
  createAudit(tenantId: $tenantId, input: $input) {
    id
    title
    type
    status
  }
}

mutation CreateFinding($tenantId: String!, $input: CreateFindingInput!) {
  createFinding(tenantId: $tenantId, input: $input) {
    id
    title
    severity
    status
  }
}
```

## Audit Types

- **INTERNAL** - Internal audit
- **EXTERNAL** - External audit
- **COMPLIANCE** - Compliance audit
- **IT** - IT/Information systems audit
- **OPERATIONAL** - Operational audit
- **FINANCIAL** - Financial audit
- **SPECIAL** - Special purpose audit

## Audit Status

- `PLANNED` - Audit in planning phase
- `SCHEDULED` - Audit scheduled
- `IN_PROGRESS` - Audit execution in progress
- `DRAFT_REPORT` - Audit report being drafted
- `REPORT_ISSUED` - Audit report issued
- `CLOSED` - Audit formally closed

## Audit Priority

- `CRITICAL` - Immediate execution required
- `HIGH` - High priority scheduling
- `MEDIUM` - Normal priority scheduling
- `LOW` - Low priority scheduling

## Finding Severity

- `CRITICAL` - Critical risk requiring immediate attention
- `MAJOR` - Major finding with significant risk
- `MINOR` - Minor finding with minimal risk
- `OBSERVATION` - Observation for improvement

## Finding Status

- `OPEN` - Finding open, awaiting remediation
- `IN_REMEDIATION` - Remediation actions underway
- `REMEDIATED` - Remediation completed, pending verification
- `CLOSED` - Finding formally closed
- `DEFERRED` - Finding deferred

## Evidence Types

- `INTERVIEW` - Interview notes
- `OBSERVATION` - Field observation
- `DOCUMENT` - Document evidence
- `TEST_RESULT` - Test result
- `WALKTHROUGH` - Process walkthrough notes
- `SAMPLING` - Sampling test results
- `SYSTEM_OUTPUT` - System generated output
- `OTHER` - Other evidence type

## Architecture

### Service Structure

```
src/
├── main.ts                      # Application entry point
├── app.module.ts                # Root module
├── config/                      # Configuration
├── common/                      # Shared utilities
│   ├── filters/                # Exception filters
│   ├── interceptors/           # HTTP interceptors
│   └── guards/                 # Route guards
├── prisma/                      # Database layer
└── audit/                       # Audit module
    ├── audit.service.ts         # Business logic
    ├── audit.controller.ts      # REST endpoints
    ├── audit.resolver.ts        # GraphQL endpoints
    ├── dto/                     # Data transfer objects
    └── audit.service.spec.ts    # Tests
```

### Request Flow

```
Client Request
    ↓
CORS Middleware
    ↓
Authentication Guard
    ↓
Request Validation Pipe
    ↓
Controller/Resolver
    ↓
Service (Business Logic)
    ↓
Prisma Client (Database)
    ↓
Response
```

## Database Schema

### Audit Model

```prisma
model Audit {
  id                String
  tenantId          String
  title             String
  description       String
  type              String        // internal, external, compliance, etc.
  status            String        // planned, in_progress, report_issued, closed
  priority          String        // critical, high, medium, low
  scheduledDate     DateTime
  auditScope        String?
  leadAuditor       String?       // User ID
  auditedArea       String?
  estimatedDays     Int
  findings          Finding[]
  createdAt         DateTime
  updatedAt         DateTime
  deletedAt         DateTime?
}
```

### Finding Model

```prisma
model Finding {
  id            String
  tenantId      String
  auditId       String
  title         String
  description   String
  severity      String        // critical, major, minor, observation
  category      String
  rootCause     String?
  recommendation String?
  status        String        // open, in_remediation, remediated, closed
  assignedTo    String?       // User ID
  audit         Audit
  evidence      Evidence[]
  createdAt     DateTime
  updatedAt     DateTime
  deletedAt     DateTime?
}
```

### Evidence Model

```prisma
model Evidence {
  id          String
  tenantId    String
  findingId   String
  title       String
  description String
  type        String        // interview, observation, document, etc.
  documentUrl String?
  collectedBy String?       // User ID
  reference   String?
  finding     Finding
  createdAt   DateTime
  deletedAt   DateTime?
}
```

## Audit Analytics

### Audit Statistics

```json
{
  "total": 45,
  "byStatus": {
    "planned": 5,
    "scheduled": 8,
    "in_progress": 3,
    "draft_report": 2,
    "report_issued": 18,
    "closed": 9
  },
  "byType": {
    "internal": 20,
    "external": 12,
    "compliance": 8,
    "it": 3,
    "operational": 2
  },
  "inProgressCount": 18,
  "completedCount": 27
}
```

### Finding Statistics

```json
{
  "total": 127,
  "bySeverity": {
    "critical": 3,
    "major": 18,
    "minor": 85,
    "observation": 21
  },
  "byStatus": {
    "open": 12,
    "in_remediation": 25,
    "remediated": 45,
    "closed": 40,
    "deferred": 5
  },
  "openCount": 37,
  "remediatedCount": 85,
  "criticalCount": 3
}
```

## Testing

### Unit Tests

```bash
pnpm test
```

All service methods have unit tests with mocked Prisma client.

### Integration Tests

```bash
pnpm test:e2e
```

Tests against real database instance (in Docker).

### Test Coverage

Target: **80%+ coverage**

Current focus:
- ✅ Service logic
- ✅ API endpoints
- 🔄 Controller validation
- 🔄 Error scenarios

## Error Handling

### Exception Filter

All exceptions are caught and formatted consistently:

```json
{
  "statusCode": 400,
  "timestamp": "2026-05-13T10:00:00Z",
  "path": "/api/v1/audits",
  "message": "Invalid audit type",
  "errors": {
    "type": "Must be one of: internal, external, compliance, it, operational, financial, special"
  }
}
```

### Common Errors

- **400 Bad Request:** Invalid input data or missing tenant
- **401 Unauthorized:** Missing/invalid JWT token
- **403 Forbidden:** No permission for resource
- **404 Not Found:** Resource doesn't exist
- **409 Conflict:** Resource already exists
- **500 Internal Error:** Server error

## Configuration

### Environment Variables

```env
PORT=3004
NODE_ENV=development
LOG_LEVEL=debug

DATABASE_URL=postgresql://...
REDIS_URL=redis://...

JWT_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

## Performance

### Metrics

- **API Latency:** <200ms p99
- **DB Queries:** Optimized with indexes
- **Caching:** Redis for frequent queries
- **Concurrency:** Connection pooling

### Optimization

```typescript
// ✅ Efficient: Single query with relations
const audits = await prisma.audit.findMany({
  include: { findings: { include: { evidence: true } } }
});

// ❌ Inefficient: N+1 query problem
const audits = await prisma.audit.findMany();
for (const audit of audits) {
  const findings = await prisma.finding.findMany({ ... });
}
```

## Monitoring

### Endpoints

- `GET /health` - Full health check
- `GET /healthz` - Liveness probe

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-05-13T10:00:00Z",
  "service": "audit-service",
  "version": "0.1.0"
}
```

### Logging

- **INFO:** Service events, requests
- **WARN:** Non-critical issues
- **ERROR:** Exception details
- **DEBUG:** Detailed tracing (dev only)

## Deployment

### Docker

```bash
# Build
docker build -t openrisks/audit-service .

# Run
docker run -p 3004:3004 openrisks/audit-service
```

### Kubernetes

```bash
kubectl apply -f k8s/audit-service.yaml
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

### Code Style

- TypeScript with strict mode
- Explicit return types required
- No `any` types
- Comments for complex logic only

### Testing Requirements

- Minimum 80% coverage
- All public methods tested
- Integration tests for workflows
- Error scenarios covered

## Troubleshooting

### Service Won't Start

```bash
# Check environment
cat .env

# Check database connection
psql $DATABASE_URL -c "SELECT 1"

# Check logs
pnpm dev 2>&1
```

### Database Issues

```bash
# Reset database
dropdb openrisksos
createdb openrisksos
pnpm db:migrate
pnpm db:seed
```

### Tests Failing

```bash
# Clear cache
rm -rf node_modules/.cache

# Reinstall
pnpm install

# Run tests with verbose output
pnpm test --verbose
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [GraphQL Documentation](https://graphql.org/)
- [OpenRiskOS Architecture](../../docs/ARCHITECTURE.md)

## License

AGPL-3.0 (see [LICENSE](../../LICENSE))

---

**Status:** 🚀 **In Development**  
**Version:** 0.1.0  
**Maintainer:** OpenRiskOS Team
