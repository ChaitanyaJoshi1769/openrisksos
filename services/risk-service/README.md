# Risk Service

**Enterprise Risk Management Microservice** for OpenRiskOS.

This service handles all risk management operations including risk creation, scoring, heatmap generation, KRI management, and risk assessment workflows.

## Features

- **Risk Management:** Create, read, update, delete risks
- **Risk Scoring:** Automatic inherent and residual risk calculation
- **Heatmaps:** 5x5 probability-impact matrices
- **KRIs:** Key Risk Indicator tracking
- **Mitigations:** Track and manage risk mitigations
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

# Type check
pnpm typecheck
```

### Production

```bash
# Build
pnpm build

# Start
pnpm start
```

## API Endpoints

### REST API (`/api/v1`)

#### Risks

- `GET /risks` - List all risks
- `POST /risks` - Create risk
- `GET /risks/:id` - Get risk details
- `PUT /risks/:id` - Update risk
- `DELETE /risks/:id` - Delete risk (soft)
- `POST /risks/:id/calculate-residual` - Calculate residual score
- `GET /risks/heatmap` - Get risk heatmap
- `GET /risks/:id/kris` - Get KRIs for risk

### GraphQL (`/graphql`)

```graphql
query GetRisks($filter: RiskFilterInput) {
  risks(filter: $filter) {
    id
    title
    probability
    inherentScore
    owner { name }
  }
}

mutation CreateRisk($input: CreateRiskInput!) {
  createRisk(input: $input) {
    id
    title
    inherentScore
  }
}
```

## Architecture

### Service Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root module
├── config/                 # Configuration
├── common/                 # Shared utilities
│   ├── filters/           # Exception filters
│   ├── interceptors/      # HTTP interceptors
│   ├── guards/            # Route guards
│   └── decorators/        # Custom decorators
├── prisma/                # Database layer
└── risks/                 # Risk module
    ├── risks.service.ts   # Business logic
    ├── risks.controller.ts # REST endpoints
    ├── risks.resolver.ts  # GraphQL endpoints
    ├── dto/               # Data transfer objects
    └── risks.service.spec.ts # Tests
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

## Risk Scoring

### Inherent Risk Score

Calculated as: **Probability × Impact**

- Probability: 1-5 scale
- Impact: 1-5 scale
- Score: 1-25

Example: Probability 3 × Impact 4 = Score 12

### Residual Risk Score

Calculated after mitigations:

```
Residual Impact = Inherent Impact × (1 - Mitigation Effectiveness)
Residual Score = Probability × Residual Impact
```

Example:
- Inherent Score: 12 (3 × 4)
- Mitigation Effectiveness: 60%
- Residual Impact: 4 × (1 - 0.60) = 1.6 ≈ 2
- Residual Score: 3 × 2 = 6

## Risk Heatmap

5×5 matrix showing distribution of risks:

- X-axis: Probability (1-5)
- Y-axis: Impact (1-5)
- Values: Count of risks in each cell

```
    1  2  3  4  5
  +--+--+--+--+--+
5 | 0| 1| 2| 1| 0|
4 | 1| 2| 3| 2| 1|
3 | 2| 3| 5| 3| 2|
2 | 1| 2| 3| 2| 1|
1 | 0| 1| 2| 1| 0|
  +--+--+--+--+--+
```

## Database Schema

### Risk Model

```prisma
model Risk {
  id                String
  tenantId          String
  title             String
  description       String?
  riskCategory      String    // strategic, operational, compliance, financial, cyber, reputational
  probability       Int       // 1-5
  inherentImpact    Int       // 1-5
  inherentScore     Int       // calculated
  residualImpact    Int?
  residualScore     Int?
  status            String    // active, mitigated, closed, on_hold
  owner             User
  businessUnit      String?
  mitigations       RiskMitigation[]
  metrics           KRI[]
  createdAt         DateTime
  updatedAt         DateTime
  deletedAt         DateTime?
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
  "path": "/api/v1/risks",
  "message": "Invalid risk probability",
  "errors": {
    "probability": "Must be between 1 and 5"
  }
}
```

### Common Errors

- **400 Bad Request:** Invalid input data
- **401 Unauthorized:** Missing/invalid JWT token
- **403 Forbidden:** No permission for resource
- **404 Not Found:** Resource doesn't exist
- **409 Conflict:** Resource already exists
- **500 Internal Error:** Server error

## Configuration

### Environment Variables

```env
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug

DATABASE_URL=postgresql://...
REDIS_URL=redis://...

JWT_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:3000

OPENAI_API_KEY=...
NEO4J_URL=neo4j://...
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
const risks = await prisma.risk.findMany({
  include: { owner: true, mitigations: true }
});

// ❌ Inefficient: N+1 query problem
const risks = await prisma.risk.findMany();
for (const risk of risks) {
  const owner = await prisma.user.findUnique({ ... });
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
  "service": "risk-service",
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
docker build -t openrisks/risk-service .

# Run
docker run -p 3001:3001 openrisks/risk-service
```

### Kubernetes

```bash
kubectl apply -f k8s/risk-service.yaml
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

**Status:** ✅ **Production Ready**  
**Version:** 0.1.0  
**Maintainer:** OpenRiskOS Team
