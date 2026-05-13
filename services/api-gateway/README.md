# API Gateway

Enterprise-grade API Gateway for OpenRiskOS with request routing, rate limiting, authentication, and request logging.

## Features

### Request Routing
- Routes requests to 5 microservices (Risk, Compliance, Incident, Audit, Vendor)
- HTTP/REST and GraphQL support
- Service discovery via environment variables
- Request forwarding with header preservation

### Rate Limiting
- **Per-Tenant Rate Limiting**: 1000 requests per 15 minutes per tenant
- **Global Rate Limiting**: 5000 requests per 15 minutes per IP
- Rate limit headers in responses (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
- Graceful degradation with 429 status code

### Security
- Helmet.js for HTTP security headers
- CORS configuration
- Request validation
- Tenant ID enforcement
- Input sanitization

### Observability
- Request ID tracking (X-Request-ID header)
- Request logging with duration tracking
- Service health checks
- Error tracking and reporting

## API Endpoints

### Health & Info
- `GET /health` - Gateway health status and service URLs
- `GET /api/v1/info` - Gateway info and API documentation

### Risk Service
- `POST /api/v1/risks` - Create risk
- `GET /api/v1/risks` - List risks
- `GET /api/v1/risks/:id` - Get risk
- `PUT /api/v1/risks/:id` - Update risk
- `DELETE /api/v1/risks/:id` - Delete risk
- `POST /graphql/risk` - GraphQL endpoint

### Compliance Service
- `POST /api/v1/compliance/frameworks` - Create framework
- `GET /api/v1/compliance/frameworks` - List frameworks
- `POST /api/v1/compliance/controls` - Create control
- `GET /api/v1/compliance/controls` - List controls
- `POST /api/v1/compliance/evidence` - Create evidence
- `POST /graphql/compliance` - GraphQL endpoint

### Incident Service
- `POST /api/v1/incidents` - Create incident
- `GET /api/v1/incidents` - List incidents
- `PUT /api/v1/incidents/:id` - Update incident
- `POST /api/v1/incidents/:id/timeline` - Add timeline event
- `POST /graphql/incident` - GraphQL endpoint

### Audit Service
- `POST /api/v1/audits` - Create audit
- `GET /api/v1/audits` - List audits
- `POST /api/v1/audits/:id/findings` - Add finding
- `POST /api/v1/audits/:id/evidence` - Add evidence
- `POST /graphql/audit` - GraphQL endpoint

### Vendor Service
- `POST /api/v1/vendors` - Create vendor
- `GET /api/v1/vendors` - List vendors
- `POST /api/v1/vendors/:id/assessments` - Add assessment
- `POST /api/v1/vendors/:id/breaches` - Report breach
- `POST /graphql/vendor` - GraphQL endpoint

## Required Headers

### All Requests
```
X-Tenant-ID: {tenant-id}              // Required for all API calls
X-Request-ID: {request-id}            // Optional, generated if not provided
```

### Authentication Requests
```
Authorization: Bearer {jwt-token}     // For authenticated endpoints
```

## Rate Limit Response

When rate limit is exceeded:
```json
{
  "statusCode": 429,
  "message": "Too many requests",
  "retryAfter": 300
}
```

Response headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2026-05-13T13:15:00Z
```

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Update `.env` with your service URLs:
```env
PORT=3000
NODE_ENV=development
RISK_SERVICE_URL=http://localhost:3001
COMPLIANCE_SERVICE_URL=http://localhost:3002
INCIDENT_SERVICE_URL=http://localhost:3003
AUDIT_SERVICE_URL=http://localhost:3004
VENDOR_SERVICE_URL=http://localhost:3005
CORS_ORIGIN=*
```

### Development

```bash
npm run dev
```

Server starts on port 3000.

### Building

```bash
npm run build
npm start
```

## Architecture

### Request Flow

```
Client Request
    ↓
CORS & Security Headers (Helmet)
    ↓
Request ID Generation
    ↓
Request Logging
    ↓
Global Rate Limiting (IP-based)
    ↓
Tenant Rate Limiting
    ↓
Tenant Validation (X-Tenant-ID)
    ↓
Service Routing (HTTP Proxy)
    ↓
Microservice
    ↓
Response Logging
    ↓
Client Response
```

### Rate Limiting Strategy

```
Global Limit (5000/15min per IP)
    ↓
Tenant Limit (1000/15min per tenant)
    ↓
Allow Request
    ↓
Forward to Service
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Gateway port |
| NODE_ENV | development | Environment |
| RISK_SERVICE_URL | http://localhost:3001 | Risk service URL |
| COMPLIANCE_SERVICE_URL | http://localhost:3002 | Compliance service URL |
| INCIDENT_SERVICE_URL | http://localhost:3003 | Incident service URL |
| AUDIT_SERVICE_URL | http://localhost:3004 | Audit service URL |
| VENDOR_SERVICE_URL | http://localhost:3005 | Vendor service URL |
| CORS_ORIGIN | * | CORS origin |

## Monitoring

### Health Checks

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-05-13T13:00:00Z",
  "services": {
    "risk": "http://localhost:3001",
    "compliance": "http://localhost:3002",
    "incident": "http://localhost:3003",
    "audit": "http://localhost:3004",
    "vendor": "http://localhost:3005"
  }
}
```

### Request Logging

Each request is logged with:
- Request ID
- HTTP method
- Path
- Status code
- Duration (ms)

Example:
```
[550e8400-e29b-41d4-a716-446655440000] GET /api/v1/risks 200 125ms
```

## Error Handling

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "timestamp": "2026-05-13T13:00:00Z",
  "path": "/api/v1/risks"
}
```

### Common Status Codes

- `200 OK` - Successful request
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Missing/invalid auth
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `503 Service Unavailable` - Service down

## Production Deployment

### Docker

```bash
docker build -t api-gateway .
docker run -p 3000:3000 --env-file .env api-gateway
```

### Kubernetes

```bash
kubectl apply -f k8s/api-gateway.yaml
```

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=3000
RISK_SERVICE_URL=https://risk.example.com
COMPLIANCE_SERVICE_URL=https://compliance.example.com
INCIDENT_SERVICE_URL=https://incident.example.com
AUDIT_SERVICE_URL=https://audit.example.com
VENDOR_SERVICE_URL=https://vendor.example.com
CORS_ORIGIN=https://dashboard.example.com
```

## Performance Tuning

### Request Timeout
- Default: 30 seconds
- Adjustable via `timeout` and `proxyTimeout` options

### Buffer Limits
- JSON limit: 10MB
- URL-encoded limit: 10MB

### Rate Limiting
- Window: 15 minutes
- Per-tenant limit: 1000 requests
- Global limit: 5000 requests

## Troubleshooting

### Service Unavailable (503)

Check if microservice is running:
```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
```

### Rate Limit Exceeded (429)

Wait for the window to reset or use batch requests.

### Missing X-Tenant-ID

All API calls require X-Tenant-ID header:
```bash
curl -H "X-Tenant-ID: tenant-123" http://localhost:3000/api/v1/risks
```

## Development Guide

### Adding a New Service

1. Add service URL to environment variables
2. Add service route in `main.ts`
3. Create proxy instance
4. Add routing handlers

```typescript
// Service configuration
const serviceRoutes = {
  newService: process.env.NEW_SERVICE_URL || 'http://localhost:3006',
};

// Proxy creation
const proxies = {
  newService: createProxy(serviceRoutes.newService),
};

// Routing
app.use('/api/v1/newservice', proxies.newService);
```

## Testing

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## Dependencies

- `express` - Web framework
- `http-proxy` - HTTP proxying
- `express-rate-limit` - Rate limiting middleware
- `helmet` - Security headers
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `uuid` - Request ID generation

## Security Considerations

1. **Rate Limiting**: Prevents abuse and DDoS attacks
2. **Tenant Isolation**: Each tenant has isolated rate limits
3. **CORS**: Configurable origin restrictions
4. **Helmet**: Security headers for XSS, clickjacking, etc.
5. **Input Validation**: Tenant ID validation
6. **Error Messages**: Safe error messages in production

## License

Part of OpenRiskOS - Enterprise GRC Platform
