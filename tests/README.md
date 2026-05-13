# Integration Tests for OpenRiskOS

Comprehensive integration and end-to-end tests for OpenRiskOS microservices.

## Test Structure

```
tests/
├── integration/
│   ├── api-gateway.test.ts          # API Gateway tests
│   ├── risk-service.test.ts         # Risk Service tests
│   ├── compliance-service.test.ts   # Compliance Service tests
│   ├── incident-service.test.ts     # Incident Service tests
│   ├── audit-service.test.ts        # Audit Service tests
│   └── vendor-service.test.ts       # Vendor Service tests
├── e2e/
│   ├── workflows.test.ts            # End-to-end workflows
│   └── dashboards.test.ts           # Dashboard tests
├── jest.config.js
├── package.json
└── README.md
```

## Prerequisites

### Running Services

All microservices must be running before tests:

```bash
# Start API Gateway
cd services/api-gateway && npm run dev

# Start Risk Service
cd services/risk-service && npm run dev

# Start Compliance Service
cd services/compliance-service && npm run dev

# Start Incident Service
cd services/incident-service && npm run dev

# Start Audit Service
cd services/audit-service && npm run dev

# Start Vendor Service
cd services/vendor-service && npm run dev

# Database running
# PostgreSQL on localhost:5432
```

Or use Docker Compose:

```bash
docker-compose up -d
```

### Environment

```bash
# Copy environment template
cp .env.example .env

# Verify service URLs
RISK_SERVICE_URL=http://localhost:3001
COMPLIANCE_SERVICE_URL=http://localhost:3002
INCIDENT_SERVICE_URL=http://localhost:3003
AUDIT_SERVICE_URL=http://localhost:3004
VENDOR_SERVICE_URL=http://localhost:3005
API_GATEWAY_URL=http://localhost:3000
```

## Installation

```bash
npm install
```

## Running Tests

### All Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

### Specific Service Tests

```bash
# API Gateway
npm run test:api-gateway

# Risk Service
npm run test:risk-service
```

### End-to-End Tests

```bash
npm run test:e2e
```

## Test Suites

### API Gateway Tests (`api-gateway.test.ts`)

Tests the central API Gateway that routes requests to microservices.

#### Test Coverage
- **Health & Info Endpoints**
  - GET /health - Returns gateway status
  - GET /api/v1/info - Returns API documentation

- **Request Headers & Validation**
  - X-Tenant-ID validation
  - X-Request-ID generation and tracking
  - Custom header preservation

- **Rate Limiting**
  - Rate limit headers in responses
  - Graceful rejection when limit exceeded
  - Per-tenant rate limiting

- **404 Handling**
  - Unknown paths return 404

- **CORS & Security**
  - CORS headers present
  - Security headers (Helmet)

### Risk Service Tests (`risk-service.test.ts`)

Tests the Risk Management service.

#### Test Coverage
- **CRUD Operations**
  - Create risk (POST /api/v1/risks)
  - List risks (GET /api/v1/risks)
  - Get single risk (GET /api/v1/risks/:id)
  - Update risk (PUT /api/v1/risks/:id)
  - Delete risk (DELETE /api/v1/risks/:id)

- **Validation**
  - Probability range (1-5)
  - Impact range (1-5)
  - Required fields (title)

- **Filtering & Search**
  - Filter by status
  - Pagination (skip, take)
  - Search by keyword

- **Risk Scoring**
  - Inherent score = Probability × Impact
  - Residual score with mitigation effectiveness
  - Score calculation accuracy

- **Risk Heatmap**
  - 5×5 probability-impact matrix
  - Distribution visualization

- **Tenant Isolation**
  - Risks isolated by tenant
  - Cross-tenant access denied

- **Error Handling**
  - 404 for non-existent risks
  - Consistent error format
  - Proper HTTP status codes

### Compliance Service Tests (`compliance-service.test.ts`)

Tests the Compliance Management service.

#### Test Coverage
- **Framework Operations**
  - Create framework
  - List frameworks
  - Get specific framework
  - Update framework
  - Delete framework

- **Control Operations**
  - Create control
  - List controls
  - Update control status
  - Track compliance percentage

- **Evidence Management**
  - Create evidence
  - Link evidence to controls
  - Track evidence types

- **Control Test Operations**
  - Create control test
  - Track test results
  - Update test status

- **Compliance Calculation**
  - Percentage calculation accuracy
  - Per-framework compliance
  - Aggregate compliance score

### Incident Service Tests (`incident-service.test.ts`)

Tests the Incident Management service.

#### Test Coverage
- **Incident Operations**
  - Create incident
  - List incidents
  - Get incident details
  - Update incident
  - Update status through lifecycle

- **Timeline Management**
  - Add timeline events
  - Event type validation
  - Chronological ordering

- **Corrective Actions**
  - Create action
  - Track action status
  - Due date management
  - Overdue detection

- **Analytics**
  - Incident statistics
  - Status distribution
  - Resolution time tracking

### Audit Service Tests (`audit-service.test.ts`)

Tests the Audit Management service.

#### Test Coverage
- **Audit Operations**
  - Create audit
  - List audits
  - Get audit details
  - Update audit
  - Track audit lifecycle

- **Finding Management**
  - Create finding
  - Update finding status
  - Due date tracking
  - Severity classification

- **Evidence Collection**
  - Add evidence
  - Evidence type validation
  - Link to findings

- **Audit Analytics**
  - Finding statistics
  - Status distribution
  - Compliance tracking

### Vendor Service Tests (`vendor-service.test.ts`)

Tests the Vendor Management service.

#### Test Coverage
- **Vendor Operations**
  - Create vendor
  - List vendors
  - Get vendor details
  - Update vendor
  - Risk score tracking

- **Assessment Management**
  - Create assessment
  - Track assessment status
  - Assessment type validation

- **Breach Management**
  - Report breach
  - Update breach status
  - Track affected records

- **Risk Profiling**
  - Risk score calculation
  - Trend analysis
  - Classification updates

## Test Data

Tests use consistent test tenant:

```
Tenant: test-tenant-123
Email: test-user@example.com
```

Sample data is created during each test and cleaned up after.

## Test Patterns

### Standard Test Pattern

```typescript
describe('Service Tests', () => {
  let api: AxiosInstance;

  beforeAll(() => {
    api = axios.create({
      baseURL: 'http://localhost:3001',
      headers: { 'X-Tenant-ID': 'test-tenant' },
      validateStatus: () => true, // Don't throw errors
    });
  });

  test('Should do something', async () => {
    const response = await api.post('/api/v1/resource', data);
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
  });
});
```

### Validation Pattern

```typescript
test('Should reject invalid input', async () => {
  const response = await api.post('/api/v1/resource', invalidData);
  expect(response.status).toBe(400);
  expect(response.data).toHaveProperty('errors');
});
```

### Isolation Pattern

```typescript
test('Cross-tenant access should be denied', async () => {
  const otherTenant = axios.create({
    baseURL: 'http://localhost:3001',
    headers: { 'X-Tenant-ID': 'other-tenant' },
  });
  const response = await otherTenant.get(`/api/v1/resource/${id}`);
  expect(response.status).toBe(404);
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Integration Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: openriskos
          POSTGRES_PASSWORD: password
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: docker-compose up -d
      - run: npm test
```

## Troubleshooting

### Services Not Running

```bash
# Check service health
curl http://localhost:3000/health
curl http://localhost:3001/health

# View service logs
docker-compose logs api-gateway
docker-compose logs risk-service
```

### Connection Refused

```bash
# Verify services are running on correct ports
netstat -an | grep 3000
netstat -an | grep 3001

# Start services if needed
npm run dev
```

### Database Issues

```bash
# Check database connection
psql -h localhost -U postgres -d openriskos

# Verify migrations have run
npm run db:migrate

# Seed test data
npm run db:seed
```

### Test Timeout

Increase Jest timeout in test file:

```typescript
jest.setTimeout(30000); // 30 seconds
```

## Performance Benchmarks

Expected response times:

| Endpoint | Target | Tolerance |
|----------|--------|-----------|
| GET /health | 50ms | ±10ms |
| POST /risks | 100ms | ±20ms |
| GET /risks | 150ms | ±30ms |
| GET /risks/:id | 80ms | ±15ms |

## Coverage Goals

- **API Gateway**: 90%+
- **Risk Service**: 85%+
- **Compliance Service**: 85%+
- **Incident Service**: 85%+
- **Audit Service**: 85%+
- **Vendor Service**: 85%+

View current coverage:

```bash
npm run test:coverage
open coverage/index.html
```

## Contributing

When adding tests:

1. Follow existing patterns
2. Test happy path and error cases
3. Include validation tests
4. Test tenant isolation
5. Add comments for complex logic
6. Run coverage report
7. Update README with new test areas

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Remove test data after tests
3. **Assertions**: Use specific assertions
4. **Timeouts**: Set appropriate timeouts for long operations
5. **Mocking**: Only mock external services, test integration
6. **Documentation**: Document complex test scenarios
7. **Performance**: Keep tests fast (< 5s per test)

## Known Issues

- Rate limiting tests may be flaky (time-dependent)
- Cross-service tests require all services running
- GraphQL endpoints not fully tested yet
- WebSocket tests not implemented

## Future Tests

- [ ] GraphQL endpoint tests
- [ ] WebSocket real-time tests
- [ ] Load testing
- [ ] Security testing (OWASP)
- [ ] Performance benchmarking
- [ ] Data consistency tests
- [ ] Concurrent operation tests
- [ ] Multi-tenant scenario tests

## Resources

- [Jest Documentation](https://jestjs.io)
- [Axios Documentation](https://axios-http.com)
- [Integration Testing Best Practices](https://www.testingjavascript.com)

## License

Part of OpenRiskOS - Enterprise GRC Platform
