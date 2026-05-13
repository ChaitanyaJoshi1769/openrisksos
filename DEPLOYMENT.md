# OpenRiskOS Deployment Guide

This guide covers deploying OpenRiskOS to production environments, including Kubernetes, Docker, and on-premise installations.

## Deployment Architecture

OpenRiskOS supports multiple deployment models:

1. **SaaS (Cloud)** - Managed service on AWS/Azure/GCP
2. **Self-Hosted Kubernetes** - On your K8s cluster
3. **Docker Compose** - Single-node Docker deployment
4. **On-Premise** - Traditional server installation

## Prerequisites

### For Kubernetes Deployment

- Kubernetes cluster (v1.24+)
- `kubectl` configured
- Helm 3+
- Container registry access (ECR/Docker Hub/GHCR)
- Persistent storage (EBS/NFS/Blob)
- LoadBalancer or Ingress Controller

### For Docker Deployment

- Docker Engine (20.10+)
- Docker Compose (2.0+)
- Minimum: 4 CPU, 8GB RAM, 100GB storage
- Ports: 3000-3010, 5432, 6379, 7687 available

### For All Deployments

- DNS domain
- TLS certificates (Let's Encrypt or custom)
- SMTP server for email notifications
- Backup storage (S3, GCS, Azure Blob)

## Kubernetes Deployment

### 1. Prepare Kubernetes Cluster

```bash
# Check cluster health
kubectl get nodes
kubectl get pods --all-namespaces

# Create namespace
kubectl create namespace openrisksos
kubectl config set-context --current --namespace=openrisksos
```

### 2. Configure Secrets

Create secrets for sensitive data:

```bash
# Database credentials
kubectl create secret generic db-credentials \
  --from-literal=POSTGRES_USER=postgres \
  --from-literal=POSTGRES_PASSWORD=<secure-password> \
  --from-literal=DATABASE_URL=postgresql://...

# API keys and secrets
kubectl create secret generic api-secrets \
  --from-literal=JWT_SECRET=<secure-jwt-secret> \
  --from-literal=OPENAI_API_KEY=<your-api-key>

# TLS certificates
kubectl create secret tls tls-cert \
  --cert=path/to/cert.pem \
  --key=path/to/key.pem
```

### 3. Configure Values

Edit `k8s/openrisksos/values.yaml`:

```yaml
# Global settings
global:
  environment: production
  domain: risk.example.com
  tlsIssuer: letsencrypt-prod

# Database
postgresql:
  enabled: true
  persistence:
    enabled: true
    size: 100Gi
    storageClassName: ebs-sc

# Redis
redis:
  enabled: true
  persistence:
    enabled: true
    size: 10Gi

# Services replicas
replicas:
  apiGateway: 3
  riskService: 3
  complianceService: 2
  incidentService: 2
  aiService: 2

# Resource limits
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "2Gi"
    cpu: "1000m"

# Autoscaling
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

### 4. Install Helm Chart

```bash
# Add Helm repository
helm repo add openrisksos https://helm.openrisks.io
helm repo update

# Install
helm install openrisksos openrisksos/openrisksos \
  --namespace openrisksos \
  --values k8s/openrisksos/values.yaml \
  --wait

# Verify installation
kubectl rollout status deployment/openrisksos-api-gateway
kubectl get pods
```

### 5. Configure Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: openrisksos-ingress
  namespace: openrisksos
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - risk.example.com
    secretName: tls-cert
  rules:
  - host: risk.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: openrisksos-web
            port:
              number: 3000
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: openrisksos-api-gateway
            port:
              number: 3002
```

Apply:
```bash
kubectl apply -f k8s/ingress.yaml
```

### 6. Configure Monitoring

```bash
# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace openrisksos

# Install Grafana dashboards
kubectl apply -f infrastructure/grafana-dashboards.yaml

# View Grafana
kubectl port-forward svc/prometheus-grafana 3000:80
# Access: http://localhost:3000
```

### 7. Setup Backups

```yaml
# Create backup policy
apiVersion: velero.io/v1
kind: BackupStorageLocation
metadata:
  name: aws-s3
  namespace: velero
spec:
  provider: aws
  bucket: openrisksos-backups
  config:
    region: us-east-1
    s3Url: https://s3.amazonaws.com
```

## Docker Compose Deployment

### 1. Prepare Environment

Clone repository and create production `.env`:

```bash
cp docker-compose.yml docker-compose.prod.yml

# Create .env.prod
cat > .env.prod << 'EOF'
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<secure-password>
DATABASE_URL=postgresql://postgres:<secure-password>@postgres:5432/openrisksos

# Services
NODE_ENV=production
PORT=3001
LOG_LEVEL=info

# Authentication
JWT_SECRET=<secure-jwt-secret>
KEYCLOAK_PASSWORD=<keycloak-password>

# API
API_URL=https://risk.example.com
CORS_ORIGINS=https://risk.example.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=<app-password>

# AI
OPENAI_API_KEY=<your-api-key>

# S3/Object Storage
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
S3_BUCKET=openrisksos-data
EOF
```

### 2. Configure Services

Edit `docker-compose.prod.yml` to update:
- Resource limits
- Restart policies
- Log drivers
- Health checks

### 3. Start Services

```bash
docker-compose -f docker-compose.prod.yml up -d

# Verify
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. Setup SSL/TLS

Using Let's Encrypt with Nginx:

```bash
# Install Certbot
apt-get install certbot python3-certbot-nginx

# Get certificate
certbot certonly --standalone -d risk.example.com

# Auto-renewal
systemctl enable certbot.timer
```

Configure Nginx as reverse proxy:

```nginx
upstream openrisksos {
  server localhost:3000;
  server localhost:3001;
}

server {
  listen 443 ssl http2;
  server_name risk.example.com;

  ssl_certificate /etc/letsencrypt/live/risk.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/risk.example.com/privkey.pem;

  location / {
    proxy_pass http://openrisksos;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

server {
  listen 80;
  server_name risk.example.com;
  return 301 https://$server_name$request_uri;
}
```

## Database Migration

### From Legacy System

1. **Export data** from existing GRC system
2. **Transform** using migration scripts in `scripts/migrations/`
3. **Validate** data integrity
4. **Import** into PostgreSQL
5. **Test** thoroughly before cutover

Example migration script:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateRisks() {
  const risks = await legacyDb.query('SELECT * FROM risks');

  for (const risk of risks) {
    await prisma.risk.create({
      data: {
        tenantId: 'legacy-tenant',
        title: risk.title,
        description: risk.description,
        // ... map fields
      },
    });
  }

  console.log(`Migrated ${risks.length} risks`);
}

migrateRisks().catch(console.error).finally(() => prisma.$disconnect());
```

## Security Hardening

### Network Security

```bash
# Enable firewall
sudo ufw enable
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp
sudo ufw allow 22/tcp
```

### Database Security

```sql
-- Create limited database user
CREATE USER app_user WITH PASSWORD '<strong-password>';
GRANT CONNECT ON DATABASE openrisksos TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
```

### Audit Logging

Enable PostgreSQL audit logging:

```sql
CREATE EXTENSION IF NOT EXISTS pgaudit;
ALTER SYSTEM SET pgaudit.log = 'ALL';
SELECT pg_reload_conf();
```

### Secrets Management

Use external secret managers:

```bash
# AWS Secrets Manager
aws secretsmanager create-secret \
  --name openrisksos/jwt-secret \
  --secret-string '<jwt-secret>'

# HashiCorp Vault
vault kv put secret/openrisksos \
  jwt_secret=<jwt-secret> \
  db_password=<db-password>
```

## Monitoring & Alerting

### Prometheus Scrape Config

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'openrisksos-api'
    static_configs:
      - targets: ['localhost:3001']

  - job_name: 'postgresql'
    static_configs:
      - targets: ['localhost:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:9121']
```

### Alert Rules

```yaml
groups:
  - name: openrisksos
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"

      - alert: DatabaseDown
        expr: up{job="postgresql"} == 0
        for: 1m
        annotations:
          summary: "PostgreSQL is down"

      - alert: DiskSpaceRunningOut
        expr: node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.1
        for: 5m
        annotations:
          summary: "Disk usage > 90%"
```

## Backup & Recovery

### Automated Backups

```bash
# PostgreSQL backup script
#!/bin/bash
BACKUP_DIR="/backups/openrisksos"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump -U postgres openrisksos | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://openrisksos-backups/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -mtime +30 -delete
```

### Restore from Backup

```bash
# Restore database
gunzip < db_backup.sql.gz | psql -U postgres openrisksos

# Verify data
psql -U postgres openrisksos -c "SELECT COUNT(*) FROM risks;"
```

## Scaling Considerations

### Horizontal Scaling

- **Stateless services** scale automatically
- **Database** use replication and read replicas
- **Cache** use Redis cluster
- **Search** use OpenSearch cluster

### Vertical Scaling

When horizontal scaling isn't enough, increase per-pod resources in `values.yaml`

### Performance Optimization

```bash
# Enable query caching
redis-cli CONFIG SET maxmemory-policy allkeys-lru

# Optimize PostgreSQL
psql -U postgres -c "
VACUUM ANALYZE;
CREATE INDEX idx_risks_status ON risks(status);
CREATE INDEX idx_incidents_created ON incidents(createdAt);
"
```

## Maintenance & Updates

### Rolling Updates

```bash
# Update Helm chart
helm upgrade openrisksos openrisksos/openrisksos \
  --namespace openrisksos \
  --values values.yaml \
  --wait

# Verify rollout
kubectl rollout status deployment/openrisksos-api-gateway
```

### Database Migrations

Migrations run automatically before service startup:

```typescript
// services/risk-service/src/main.ts
async function bootstrap() {
  // Run migrations
  await runMigrations();

  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}
```

### Health Checks

```bash
# Check all services
curl https://risk.example.com/health

# Detailed status
curl https://risk.example.com/api/system/health
```

## Troubleshooting

### Services Not Starting

```bash
# Check logs
kubectl logs -f deployment/openrisksos-api-gateway

# Check pod status
kubectl describe pod <pod-name>

# Check resource availability
kubectl top nodes
kubectl top pods
```

### Database Connection Issues

```bash
# Test connection
psql postgresql://user:password@host:5432/openrisksos

# Check connection limits
psql -c "SHOW max_connections;"
psql -c "SELECT count(*) FROM pg_stat_activity;"
```

### High Memory Usage

```bash
# Check memory usage
kubectl top pods --sort-by=memory

# Reduce cache size or increase limits
kubectl set resources deployment openrisksos-api-gateway \
  --limits=memory=2Gi,cpu=1000m
```

## Support & Help

- **Docs:** https://docs.openrisks.io
- **Issues:** https://github.com/openrisks/openrisksos/issues
- **Email:** support@openrisks.io

---

**Production-ready deployment is critical for enterprise users!** 🔒
