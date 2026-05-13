# Incident Service

**Enterprise Incident Management Microservice** for OpenRiskOS.

This service handles incident intake, investigation workflows, corrective action tracking (CAPA), and incident analytics.

## Features

- **Incident Management:** Create, track, and manage security incidents and operational events
- **Investigation Workflows:** Timeline-based investigation tracking
- **Corrective Actions (CAPA):** Immediate, corrective, and preventive action tracking
- **Severity & Type Classification:** CRITICAL/HIGH/MEDIUM/LOW/INFO severity with 8 incident types
- **Status Tracking:** OPEN → INVESTIGATING → CONTAINMENT → RESOLVED → CLOSED
- **Incident Analytics:** Statistics, overdue actions tracking, severity distribution
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

### REST API (`/api/v1/incidents`)

#### Incidents

- `POST /` - Create incident
- `GET /` - List incidents (with filtering, pagination)
- `GET /:id` - Get incident details
- `PUT /:id` - Update incident
- `PUT /:id/status` - Update incident status
- `DELETE /:id` - Delete incident (soft)

#### Timeline

- `POST /:incidentId/timeline` - Add timeline entry
- `GET /:incidentId/timeline` - Get incident timeline
- `DELETE /timeline/:id` - Delete timeline entry

#### Corrective Actions

- `POST /:incidentId/actions` - Create corrective action
- `GET /:incidentId/actions` - Get incident corrective actions
- `PUT /actions/:id` - Update corrective action
- `PUT /actions/:id/complete` - Mark action as complete
- `DELETE /actions/:id` - Delete corrective action

#### Analytics

- `GET /analytics/stats` - Get incident statistics
- `GET /analytics/overdue` - Get overdue corrective actions

### GraphQL (`/graphql`)

```graphql
query GetIncidents {
  incidents(tenantId: "tenant-123") {
    data {
      id
      title
      severity
      status
      detectedAt
      timelines { eventType occurredAt }
      correctiveActions { status dueDate }
    }
  }
}

query GetIncidentStats {
  incidentStats(tenantId: "tenant-123") {
    total
    bySeverity { critical high medium low }
    byStatus { open investigating resolved closed }
    openCount resolvedCount
  }
}

mutation CreateIncident($tenantId: String!, $input: CreateIncidentInput!) {
  createIncident(tenantId: $tenantId, input: $input) {
    id
    title
    severity
    status
  }
}

mutation CreateTimeline($tenantId: String!, $input: CreateTimelineInput!) {
  createTimeline(tenantId: $tenantId, input: $input) {
    id
    eventType
    occurredAt
  }
}

mutation CreateCorrectiveAction($tenantId: String!, $input: CreateCorrectiveActionInput!) {
  createCorrectiveAction(tenantId: $tenantId, input: $input) {
    id
    title
    status
    dueDate
  }
}
```

## Incident Severity

- **CRITICAL** - Immediate threat to operations or data
- **HIGH** - Significant impact with urgent response needed
- **MEDIUM** - Notable impact but manageable timeline
- **LOW** - Minor impact with planned response
- **INFO** - Informational only

## Incident Types

- `SECURITY` - Security-related incident
- `DATA_BREACH` - Unauthorized data access or disclosure
- `SYSTEM_OUTAGE` - Service or system unavailability
- `COMPLIANCE` - Compliance or regulatory violation
- `OPERATIONAL` - Operational failure or issue
- `POLICY_VIOLATION` - Policy or procedure violation
- `FRAUD` - Suspected fraudulent activity
- `OTHER` - Other incident type

## Incident Status

- `OPEN` - Incident reported, awaiting action
- `INVESTIGATING` - Active investigation underway
- `CONTAINMENT` - Containment measures being implemented
- `RESOLVED` - Incident resolved, pending closure
- `CLOSED` - Incident formally closed
- `REOPENED` - Incident reopened after closure

## Corrective Action Types

- **IMMEDIATE** - Immediate response actions (within hours)
- **CORRECTIVE** - Actions to correct the issue (within days)
- **PREVENTIVE** - Actions to prevent recurrence (within weeks)

## Timeline Event Types

- `DETECTION` - Incident initially detected
- `ESCALATION` - Incident escalated
- `INVESTIGATION` - Investigation milestone
- `CONTAINMENT` - Containment action taken
- `ERADICATION` - Threat eliminated
- `RECOVERY` - System recovery underway
- `COMMUNICATION` - Stakeholder communication
- `RESOLUTION` - Incident resolved
- `CLOSURE` - Incident formally closed
- `COMMENT` - Timeline comment/note

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
└── incident/                    # Incident module
    ├── incident.service.ts      # Business logic
    ├── incident.controller.ts   # REST endpoints
    ├── incident.resolver.ts     # GraphQL endpoints
    ├── dto/                     # Data transfer objects
    └── incident.service.spec.ts # Tests
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

### Incident Model

```prisma
model Incident {
  id                    String
  tenantId              String
  title                 String
  description           String
  type                  String        // security, data_breach, outage, etc.
  severity              String        // critical, high, medium, low, info
  status                String        // open, investigating, containment, etc.
  detectedAt            DateTime
  reportedBy            String?       // User ID
  assignedTo            String?       // User ID
  estimatedImpact       Int           // 0-100
  affectedSystems       String?
  estimatedAffectedRecords Int?
  timelines             Timeline[]
  correctiveActions     CorrectiveAction[]
  createdAt             DateTime
  updatedAt             DateTime
  deletedAt             DateTime?
}
```

### Timeline Model

```prisma
model Timeline {
  id            String
  tenantId      String
  incidentId    String
  eventType     String        // detection, investigation, resolution, etc.
  description   String
  occurredAt    DateTime
  recordedBy    String?       // User ID
  attachmentUrl String?
  incident      Incident
  createdAt     DateTime
  deletedAt     DateTime?
}
```

### CorrectiveAction Model

```prisma
model CorrectiveAction {
  id              String
  tenantId        String
  incidentId      String
  type            String        // immediate, corrective, preventive
  title           String
  description     String
  status          String        // open, in_progress, completed, etc.
  assignedTo      String?       // User ID
  dueDate         DateTime
  priority        String        // critical, high, medium, low
  expectedOutcome String?
  verified        Boolean       // Verification status
  incident        Incident
  createdAt       DateTime
  updatedAt       DateTime
  deletedAt       DateTime?
}
```

## Incident Analytics

The service provides comprehensive incident analytics:

### Incident Statistics

```json
{
  "total": 127,
  "bySeverity": {
    "critical": 3,
    "high": 12,
    "medium": 35,
    "low": 62,
    "info": 15
  },
  "byStatus": {
    "open": 5,
    "investigating": 8,
    "containment": 2,
    "resolved": 45,
    "closed": 67
  },
  "openCount": 13,
  "resolvedCount": 112
}
```

### Overdue Actions

Track corrective actions past their due dates:
- Filters by status (open, in_progress)
- Excludes completed actions
- Ordered by due date (earliest first)

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
  "path": "/api/v1/incidents",
  "message": "Invalid incident severity",
  "errors": {
    "severity": "Must be one of: critical, high, medium, low, info"
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
PORT=3003
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
const incidents = await prisma.incident.findMany({
  include: { timelines: true, correctiveActions: true }
});

// ❌ Inefficient: N+1 query problem
const incidents = await prisma.incident.findMany();
for (const incident of incidents) {
  const timelines = await prisma.timeline.findMany({ ... });
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
  "service": "incident-service",
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
docker build -t openrisks/incident-service .

# Run
docker run -p 3003:3003 openrisks/incident-service
```

### Kubernetes

```bash
kubectl apply -f k8s/incident-service.yaml
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
