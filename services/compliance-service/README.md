# Compliance Service

**Enterprise Compliance Management Microservice** for OpenRiskOS.

This service handles compliance framework management, control implementation, evidence collection, and compliance assessment workflows.

## Features

- **Compliance Frameworks:** Support for ISO27001, NIST, SOC2, HIPAA, GDPR, PCI-DSS, COBIT, and custom frameworks
- **Controls Management:** Map, track, and assess control implementation
- **Evidence Collection:** Attach evidence and documentation to controls
- **Control Testing:** Test results and remediation tracking
- **Compliance Dashboard:** Real-time compliance status and metrics
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

### REST API (`/api/v1/compliance`)

#### Frameworks

- `POST /frameworks` - Create framework
- `GET /frameworks` - List frameworks (with pagination)
- `GET /frameworks/:id` - Get framework details
- `PUT /frameworks/:id` - Update framework
- `DELETE /frameworks/:id` - Delete framework (soft)

#### Controls

- `POST /controls` - Create control
- `GET /controls` - List controls (filtered, paginated)
- `GET /controls/:id` - Get control details
- `PUT /controls/:id` - Update control
- `PUT /controls/:id/status` - Update control status
- `DELETE /controls/:id` - Delete control (soft)

#### Evidence

- `POST /evidence` - Upload evidence
- `GET /controls/:controlId/evidence` - Get evidence for control
- `DELETE /evidence/:id` - Delete evidence

#### Control Tests

- `POST /tests` - Create control test
- `GET /controls/:controlId/tests` - Get tests for control

#### Status

- `GET /status` - Get tenant compliance status

### GraphQL (`/graphql`)

```graphql
query GetFrameworks {
  frameworks(tenantId: "tenant-123") {
    data {
      id
      name
      type
      controls {
        id
        title
        status
      }
    }
  }
}

query GetComplianceStatus {
  complianceStatus(tenantId: "tenant-123") {
    totalControls
    compliantControls
    compliancePercentage
  }
}

mutation CreateFramework($tenantId: String!, $input: CreateFrameworkInput!) {
  createFramework(tenantId: $tenantId, input: $input) {
    id
    name
    type
  }
}

mutation CreateControl($tenantId: String!, $input: CreateControlInput!) {
  createControl(tenantId: $tenantId, input: $input) {
    id
    title
    status
  }
}
```

## Framework Types

- **ISO 27001** - Information Security Management System
- **NIST** - National Institute of Standards and Technology
- **SOC 2** - Service Organization Control
- **HIPAA** - Health Insurance Portability and Accountability Act
- **GDPR** - General Data Protection Regulation
- **PCI-DSS** - Payment Card Industry Data Security Standard
- **COBIT** - Control Objectives for Information and Related Technologies
- **CUSTOM** - Custom framework

## Control Status

- `NOT_STARTED` - Control not yet implemented
- `IN_PROGRESS` - Control implementation in progress
- `COMPLIANT` - Control fully implemented and tested
- `NON_COMPLIANT` - Control failed assessment
- `NOT_APPLICABLE` - Control not applicable to organization

## Control Frequency

- `CONTINUOUS` - Continuous monitoring
- `DAILY` - Daily assessment
- `WEEKLY` - Weekly assessment
- `MONTHLY` - Monthly assessment
- `QUARTERLY` - Quarterly assessment
- `ANNUAL` - Annual assessment

## Evidence Types

- `POLICY` - Policy document
- `PROCEDURE` - Procedure document
- `AUDIT_REPORT` - Audit report
- `TEST_RESULT` - Test result
- `SCREENSHOT` - System screenshot
- `LOG_FILE` - System log
- `CERTIFICATE` - Certificate or credential
- `ASSESSMENT` - Assessment document
- `OTHER` - Other documentation

## Test Results

- `PASSED` - Control passed test
- `FAILED` - Control failed test
- `INCONCLUSIVE` - Test result inconclusive
- `NOT_TESTED` - Control not yet tested

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
└── compliance/                  # Compliance module
    ├── compliance.service.ts    # Business logic
    ├── compliance.controller.ts # REST endpoints
    ├── compliance.resolver.ts   # GraphQL endpoints
    ├── dto/                     # Data transfer objects
    └── compliance.service.spec.ts # Tests
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

### ComplianceFramework Model

```prisma
model ComplianceFramework {
  id          String
  tenantId    String
  name        String
  type        String        // iso27001, nist, soc2, etc.
  description String?
  version     String?
  controls    ComplianceControl[]
  createdAt   DateTime
  updatedAt   DateTime
  deletedAt   DateTime?
}
```

### ComplianceControl Model

```prisma
model ComplianceControl {
  id            String
  tenantId      String
  frameworkId   String
  controlId     String        // e.g., A.5.1.1
  title         String
  description   String?
  status        String        // not_started, in_progress, compliant, etc.
  frequency     String        // annual, quarterly, monthly, etc.
  owner         String?       // User ID
  maturityLevel Int           // 0-100
  framework     ComplianceFramework
  evidence      Evidence[]
  tests         ControlTest[]
  createdAt     DateTime
  updatedAt     DateTime
  deletedAt     DateTime?
}
```

## Compliance Status Calculation

The compliance service tracks overall tenant compliance through several metrics:

- **Total Controls:** Total number of controls in all frameworks
- **Compliant Controls:** Controls with status = "compliant"
- **Non-Compliant Controls:** Controls with status = "non_compliant"
- **In Progress Controls:** Controls with status = "in_progress"
- **Compliance Percentage:** (Compliant / Total) × 100

Example:
```json
{
  "frameworks": 3,
  "totalControls": 157,
  "compliantControls": 125,
  "nonCompliantControls": 18,
  "inProgressControls": 14,
  "compliancePercentage": 79
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
  "path": "/api/v1/compliance/frameworks",
  "message": "Framework type must be valid",
  "errors": {
    "type": "Must be one of: iso27001, nist, soc2, hipaa, gdpr, pci_dss, cobit, custom"
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
PORT=3002
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
const controls = await prisma.complianceControl.findMany({
  include: { evidence: true, tests: true }
});

// ❌ Inefficient: N+1 query problem
const controls = await prisma.complianceControl.findMany();
for (const control of controls) {
  const evidence = await prisma.evidence.findMany({ ... });
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
  "service": "compliance-service",
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
docker build -t openrisks/compliance-service .

# Run
docker run -p 3002:3002 openrisks/compliance-service
```

### Kubernetes

```bash
kubectl apply -f k8s/compliance-service.yaml
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
