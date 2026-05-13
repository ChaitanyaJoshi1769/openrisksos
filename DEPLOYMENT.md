# OpenRiskOS Deployment Guide

Complete guide for deploying and testing OpenRiskOS locally with Docker.

## Quick Start with Docker

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 4GB+ RAM

### Start All Services

```bash
# Start services in background
docker-compose up -d

# Wait for services to initialize (2-3 minutes)
sleep 180

# Check service status
docker-compose ps

# View real-time logs
docker-compose logs -f
```

### Accessing Services

| Service | URL |
|---------|-----|
| API Gateway | http://localhost:3000 |
| Risk Service | http://localhost:3001 |
| Compliance Service | http://localhost:3002 |
| Incident Service | http://localhost:3003 |
| Audit Service | http://localhost:3004 |
| Vendor Service | http://localhost:3005 |
| Web Dashboard | http://localhost:3100 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

### Database Access

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U openriskos -d openriskos

# View users
SELECT * FROM "User";

# Exit
\q
```

## Health Checks

```bash
# All services
docker-compose ps

# Specific service
curl http://localhost:3000/health
curl http://localhost:3001/health

# Database health
docker-compose exec postgres pg_isready -U openriskos
```

## Running Tests

```bash
# Install test dependencies
cd tests && npm install

# Run integration tests (services must be running)
npm test

# Specific test suite
npm run test:api-gateway

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Stopping Services

```bash
# Stop services (data persists)
docker-compose down

# Stop and remove data
docker-compose down -v

# View service logs
docker-compose logs api-gateway
docker-compose logs risk-service
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild and start
docker-compose up -d --build
```

### Database Connection Failed

```bash
# Check PostgreSQL
docker-compose logs postgres

# Test connection
docker-compose exec postgres pg_isready -U openriskos
```

### Port Already in Use

```bash
# Change port in docker-compose.yml
# Or kill process using port
lsof -i :3000
kill -9 <PID>
```

## Default Credentials

```
Tenant ID: tenant-123
Email: user@company.com
Password: password123
```

## Production Deployment

For production deployment, see:
- Docker Swarm: Configure in docker-compose.prod.yml
- Kubernetes: Apply manifests in k8s/ directory
- AWS/GCP/Azure: Use managed Kubernetes services

For detailed instructions, refer to service-specific README files.
