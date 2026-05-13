# OpenRiskOS: System Architecture

**Version:** 1.0  
**Date:** 2026-05-13  

---

## Architecture Overview

OpenRiskOS uses a **modular, microservices-based architecture** designed for:
- **Scalability:** Horizontal scaling of services
- **Resilience:** Service isolation, graceful degradation
- **Extensibility:** Plugin system, custom integrations
- **Security:** Multi-tenant isolation, encryption, zero-trust
- **Observability:** Distributed tracing, metrics, logs

---

## Core Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Web App     │  │  Mobile App  │  │  CLI Tools   │       │
│  │  (Next.js)   │  │  (React      │  │  (Rust)      │       │
│  │              │  │   Native)    │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Kong / Nginx Ingress Controller                     │  │
│  │  ├─ Authentication & Authorization (OAuth2, SAML)   │  │
│  │  ├─ Rate Limiting & Throttling                      │  │
│  │  ├─ Request Validation & Transformation             │  │
│  │  ├─ Routing (REST, GraphQL, gRPC)                   │  │
│  │  └─ Logging & Monitoring                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  SERVICE LAYER                               │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            DOMAIN SERVICES                           │  │
│  │                                                       │  │
│  │  ┌─────────────────┐   ┌─────────────────┐         │  │
│  │  │ Risk Service    │   │ Compliance      │         │  │
│  │  │ (NestJS)        │   │ Service         │         │  │
│  │  │                 │   │ (NestJS)        │         │  │
│  │  │ ├─Risk CRUD     │   │ ├─Framework     │         │  │
│  │  │ ├─Scoring       │   │ │  Mgmt         │         │  │
│  │  │ ├─Heatmaps      │   │ ├─Controls      │         │  │
│  │  │ └─KRI           │   │ ├─Evidence      │         │  │
│  │  └─────────────────┘   │ └─Attestation   │         │  │
│  │  ┌─────────────────┐   │ └─────────────────┘         │  │
│  │  │ Incident        │   │ ┌─────────────────┐         │  │
│  │  │ Service         │   │ │ Vendor Service  │         │  │
│  │  │ (NestJS)        │   │ │ (NestJS)        │         │  │
│  │  │                 │   │ │                 │         │  │
│  │  │ ├─Intake        │   │ ├─Onboarding     │         │  │
│  │  │ ├─Management    │   │ ├─Assessment     │         │  │
│  │  │ ├─Investigation │   │ ├─Monitoring     │         │  │
│  │  │ └─Reporting     │   │ └─Risk Scoring   │         │  │
│  │  └─────────────────┘   │ └─────────────────┘         │  │
│  │  ┌─────────────────┐   │ ┌─────────────────┐         │  │
│  │  │ Audit Service   │   │ │ Workflow        │         │  │
│  │  │ (NestJS)        │   │ │ Service         │         │  │
│  │  │                 │   │ │ (NestJS)        │         │  │
│  │  │ ├─Planning      │   │ ├─Builder        │         │  │
│  │  │ ├─Workpapers    │   │ ├─Execution      │         │  │
│  │  │ ├─Findings      │   │ ├─State Machine  │         │  │
│  │  │ └─Reports       │   │ └─Notifications  │         │  │
│  │  └─────────────────┘   │ └─────────────────┘         │  │
│  │                                                       │  │
│  │  ┌─────────────────┐   ┌─────────────────┐         │  │
│  │  │ AI Service      │   │ Integrations    │         │  │
│  │  │ (Python)        │   │ Service         │         │  │
│  │  │                 │   │ (NestJS)        │         │  │
│  │  │ ├─Copilot       │   │ ├─50+ Integr.   │         │  │
│  │  │ ├─RAG           │   │ ├─Webhooks      │         │  │
│  │  │ ├─Search        │   │ ├─Polling       │         │  │
│  │  │ └─Forecasting   │   │ └─Sync          │         │  │
│  │  └─────────────────┘   │ └─────────────────┘         │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              DATA & INFRASTRUCTURE LAYER                     │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             PERSISTENCE LAYER                        │  │
│  │                                                       │  │
│  │  ┌──────────────────┐   ┌──────────────────────┐   │  │
│  │  │ PostgreSQL       │   │ Redis                │   │  │
│  │  │ (Primary DB)     │   │ (Cache, Sessions)    │   │  │
│  │  │                  │   │                      │   │  │
│  │  │ ├─ Multi-tenant  │   │ ├─ Cache layer       │   │  │
│  │  │ │  schemas       │   │ ├─ Session storage   │   │  │
│  │  │ ├─ Audit logs    │   │ ├─ Real-time events  │   │  │
│  │  │ ├─ Time-series   │   │ └─ Rate limiting     │   │  │
│  │  │ └─ JSONB fields  │   │                      │   │  │
│  │  └──────────────────┘   └──────────────────────┘   │  │
│  │  ┌──────────────────┐   ┌──────────────────────┐   │  │
│  │  │ Neo4j            │   │ OpenSearch           │   │  │
│  │  │ (Risk Graph)     │   │ (Full-text Search)   │   │  │
│  │  │                  │   │                      │   │  │
│  │  │ ├─ Risk graph    │   │ ├─ Incident search   │   │  │
│  │  │ ├─ Control graph │   │ ├─ Control search    │   │  │
│  │  │ ├─ Impact        │   │ ├─ Evidence search   │   │  │
│  │  │ │  analysis      │   │ └─ Compliance repo   │   │  │
│  │  │ └─ Path queries  │   │                      │   │  │
│  │  └──────────────────┘   └──────────────────────┘   │  │
│  │  ┌──────────────────┐   ┌──────────────────────┐   │  │
│  │  │ ClickHouse       │   │ Qdrant/pgvector      │   │  │
│  │  │ (Analytics)      │   │ (Embeddings, RAG)    │   │  │
│  │  │                  │   │                      │   │  │
│  │  │ ├─ Metrics       │   │ ├─ Document embeds   │   │  │
│  │  │ ├─ Dashboards    │   │ ├─ Policy embeds     │   │  │
│  │  │ ├─ KRIs          │   │ ├─ Evidence embeds   │   │  │
│  │  │ └─ Reports       │   │ └─ Similarity search │   │  │
│  │  └──────────────────┘   └──────────────────────┘   │  │
│  │                                                       │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ S3-Compatible Storage (MinIO / S3)           │   │  │
│  │  │ ├─ Document storage (evidence, reports)      │   │  │
│  │  │ ├─ Backup storage                            │   │  │
│  │  │ └─ Log archival                              │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│           MESSAGING & EVENT STREAMING LAYER                 │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Apache Kafka / NATS                                 │  │
│  │                                                       │  │
│  │ Topic Structure:                                      │  │
│  │ ├─ risk.* (Risk events)                              │  │
│  │ ├─ compliance.* (Compliance events)                  │  │
│  │ ├─ incident.* (Incident events)                      │  │
│  │ ├─ audit.* (Audit events)                            │  │
│  │ ├─ workflow.* (Workflow events)                      │  │
│  │ ├─ integration.* (Integration events)                │  │
│  │ └─ audit-log.* (System audit logs)                   │  │
│  │                                                       │  │
│  │ Subscribers:                                          │  │
│  │ ├─ Search indexing service                           │  │
│  │ ├─ Analytics pipeline (ClickHouse)                   │  │
│  │ ├─ Graph service (Neo4j)                             │  │
│  │ ├─ Notification service                              │  │
│  │ ├─ AI service                                        │  │
│  │ └─ Webhook delivery service                          │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│            CROSS-CUTTING SERVICES                            │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Authentication Service (Keycloak)                    │  │
│  │ ├─ OAuth2 / OIDC                                     │  │
│  │ ├─ SAML 2.0                                          │  │
│  │ ├─ MFA (TOTP, WebAuthn)                              │  │
│  │ └─ Session management                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Notification Service                                 │  │
│  │ ├─ Email (SMTP)                                      │  │
│  │ ├─ Slack / Teams / Discord                           │  │
│  │ ├─ SMS / Push notifications                          │  │
│  │ └─ In-app notifications                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ File Service                                         │  │
│  │ ├─ Document upload/download                          │  │
│  │ ├─ Virus scanning                                    │  │
│  │ ├─ PDF generation                                    │  │
│  │ └─ Storage management                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Audit Service                                        │  │
│  │ ├─ Immutable audit logging                           │  │
│  │ ├─ Change tracking                                   │  │
│  │ ├─ Retention policies                                │  │
│  │ └─ SIEM forwarding                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Analytics Pipeline                                   │  │
│  │ ├─ ClickHouse (real-time analytics)                  │  │
│  │ ├─ Prometheus (metrics)                              │  │
│  │ ├─ Grafana (dashboards)                              │  │
│  │ └─ OpenTelemetry (tracing)                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Service Directory

### API Gateway
**Role:** Entry point for all client requests
**Technology:** Kong / Nginx
**Responsibilities:**
- Authentication & authorization
- Rate limiting & throttling
- Request validation
- Routing to services
- Load balancing
- SSL/TLS termination

### Risk Service
**Role:** Enterprise Risk Management
**Technology:** NestJS
**Responsibilities:**
- Risk CRUD operations
- Risk scoring calculations
- Heatmap generation
- KRI management
- Risk trend analysis
- Risk-to-control linking

### Compliance Service
**Role:** Governance & Compliance Management
**Technology:** NestJS
**Responsibilities:**
- Compliance framework management
- Control library management
- Evidence collection & tracking
- Attestation workflows
- Gap analysis
- Compliance posture scoring

### Incident Service
**Role:** Incident Management
**Technology:** NestJS
**Responsibilities:**
- Incident intake
- Case management
- Investigation tracking
- CAPA workflows
- SLA enforcement
- Escalation management

### Audit Service
**Role:** Internal Audit Management
**Technology:** NestJS
**Responsibilities:**
- Audit planning
- Workpaper management
- Findings tracking
- Control testing
- Audit reports
- Remediation tracking

### Vendor Service
**Role:** Third-Party Risk Management
**Technology:** NestJS
**Responsibilities:**
- Vendor onboarding
- Assessment management
- Questionnaire handling
- Continuous monitoring
- Risk scoring
- Breach tracking

### Workflow Service
**Role:** Business Process Automation
**Technology:** NestJS + Temporal (workflow engine)
**Responsibilities:**
- Workflow definition & storage
- Workflow execution
- State machine management
- Approval workflows
- Notification triggers
- SLA management

### AI Service
**Role:** Intelligence & Automation
**Technology:** Python (FastAPI)
**Responsibilities:**
- RAG implementation
- Copilot interactions
- Document embedding
- Summarization
- Classification
- Forecasting
- Anomaly detection

### Integrations Service
**Role:** External System Connectivity
**Technology:** NestJS
**Responsibilities:**
- 50+ pre-built integrations
- Webhook delivery
- Data synchronization
- API polling
- Error handling & retries
- Integration marketplace

### Keycloak (Authentication)
**Role:** Identity & Access Management
**Technology:** Keycloak
**Responsibilities:**
- OAuth2 / OIDC
- SAML 2.0
- MFA
- Session management
- User provisioning
- Password policies

### Notification Service
**Role:** Multi-channel Communication
**Technology:** NestJS
**Responsibilities:**
- Email delivery
- Slack integration
- Teams integration
- Discord integration
- SMS / Push notifications
- Delivery tracking

### File Service
**Role:** Document Management
**Technology:** NestJS
**Responsibilities:**
- Document upload/download
- Virus scanning
- PDF generation
- Format conversion
- Storage lifecycle
- Access control

### Search Service
**Role:** Full-Text Search & Discovery
**Technology:** OpenSearch
**Responsibilities:**
- Incident search
- Control search
- Policy search
- Evidence search
- Autocomplete
- Faceted search

### Graph Service
**Role:** Risk Graph Queries
**Technology:** Neo4j
**Responsibilities:**
- Risk graph construction
- Impact analysis
- Relationship queries
- Path finding
- Relationship visualization

### Analytics Service
**Role:** Real-Time Analytics & Reporting
**Technology:** ClickHouse
**Responsibilities:**
- Metric aggregation
- Dashboard generation
- KRI calculation
- Compliance posture calculation
- Report generation
- Historical analysis

---

## Data Flow Architecture

### Event-Driven Communication

```
┌─────────────┐
│   Service A │────┐
└─────────────┘    │
                   │
┌─────────────┐    │    ┌──────────────┐
│   Service B │────┼───→│ Kafka/NATS   │────┐
└─────────────┘    │    └──────────────┘    │
                   │                         │
┌─────────────┐    │    ┌──────────────┐    │
│   Service C │────┘    │ Subscribers: │←───┘
└─────────────┘         │ ├─ Analytics │
                        │ ├─ Search    │
                        │ ├─ Graph     │
                        │ └─ Webhooks  │
                        └──────────────┘
```

**Benefits:**
- Loose coupling between services
- Asynchronous processing
- Audit trail of all events
- Replay capability
- Horizontal scaling

### Synchronous API Call Flow

```
Client
  ↓
API Gateway (Auth, Rate Limit)
  ↓
Router (REST/GraphQL)
  ↓
Service Handler
  ↓
Domain Logic
  ↓
Database / Cache
  ↓
Response back to client
```

### Multi-Tenant Isolation

```
Tenant 1 Data
├─ Schema: tenant_1
├─ PostgreSQL tables
├─ Redis keys (prefixed)
└─ S3 bucket (prefixed)

Tenant 2 Data
├─ Schema: tenant_2
├─ PostgreSQL tables
├─ Redis keys (prefixed)
└─ S3 bucket (prefixed)

Shared Resources
├─ Authentication (Keycloak)
├─ Configuration database
└─ System audit logs
```

---

## API Architecture

### REST API (OpenAPI 3.0)

**Base URL:** `/api/v1`

**Endpoints:**
```
/risks                           - Risk management
/compliance/frameworks           - Compliance frameworks
/compliance/controls             - Controls
/compliance/evidence             - Evidence
/incidents                       - Incidents
/incidents/:id/investigations    - Investigation workspaces
/incidents/:id/capa              - CAPA actions
/audits                          - Audits
/audits/:id/findings             - Findings
/audits/:id/workpapers           - Workpapers
/vendors                         - Vendors
/vendors/:id/assessments         - Assessments
/workflows                       - Workflows
/workflows/:id/instances         - Workflow instances
/policies                        - Policies
/dashboards                      - Dashboards
/users                           - Users
/teams                           - Teams
/integrations                    - Integrations
/ai/copilot                      - AI Copilot
/analytics/kri                   - KRI Analytics
/analytics/compliance            - Compliance Analytics
```

**Authentication:** Bearer token (JWT from Keycloak)

**Rate Limiting:** 100 requests/minute per API key

### GraphQL API (Apollo Federation)

**Endpoint:** `/graphql`

**Schema Federation:**
```
- Risk Schema
  ├─ RiskQuery
  ├─ RiskMutation
  └─ RiskSubscription

- Compliance Schema
  ├─ ComplianceQuery
  ├─ ComplianceMutation
  └─ ComplianceSubscription

- Incident Schema
  ├─ IncidentQuery
  ├─ IncidentMutation
  └─ IncidentSubscription

- ... (other services)
```

**Subscriptions:** WebSocket for real-time updates

### gRPC APIs (Internal)

Used for service-to-service communication for performance-critical paths.

---

## Deployment Architecture

### Kubernetes Deployment

**Namespaces:**
```
default             - System components
openrisksos-api     - Core API services
openrisksos-data    - Data layer
openrisksos-infra   - Infrastructure services
openrisksos-ai      - AI services
monitoring          - Observability stack
```

**Service Mesh:** Istio (optional)
- Traffic management
- Security policies
- Observability

### High Availability

**Database:**
- PostgreSQL streaming replication
- Automated failover (Patroni)
- Backup strategy (automated daily)
- 99.9% uptime SLA

**Services:**
- Min 3 replicas per service
- Health checks & liveness probes
- Pod disruption budgets
- Horizontal auto-scaling (HPA)

**Load Balancing:**
- Kubernetes service mesh
- External load balancer (ALB/NLB)
- Round-robin routing

---

## Scalability Strategy

### Horizontal Scaling

Services that scale independently:
- Risk Service (CPU-bound)
- Incident Service (I/O-bound)
- Workflow Service (Time-bound)
- AI Service (GPU-bound)
- Integrations Service (Network-bound)

### Caching Layer

**Redis:**
- Session cache
- API response cache (short-lived)
- Search cache
- Rate limit counters

**CDN:**
- Static assets
- PDF exports
- Documentation

### Database Optimization

**PostgreSQL:**
- Connection pooling (PgBouncer)
- Read replicas for analytics
- Partitioning for large tables
- Indexing strategy per table

**ClickHouse:**
- Time-series partitioning
- Data compression
- Replication for HA

---

## Security Architecture

### Authentication Flow

```
User Login
  ↓
Keycloak (OAuth2/OIDC)
  ↓
JWT Token (signed)
  ↓
API Gateway (validate token)
  ↓
Service (authorization checks)
  ↓
Resource access
```

### Authorization Model

**RBAC (Role-Based Access Control):**
- System roles (Admin, User, Auditor)
- Domain roles (Risk Owner, Compliance Officer)
- Custom roles (per tenant)

**ABAC (Attribute-Based Access Control):**
- Tenant ID
- Department
- Risk category
- Compliance framework

### Data Protection

**Encryption:**
- At Rest: AES-256 (PostgreSQL + S3)
- In Transit: TLS 1.3
- Sensitive fields (SSN, API keys): Tokenization

**Secrets Management:**
- HashiCorp Vault for secrets
- Kubernetes secrets (encrypted etcd)
- Rotation policies (90-day rotation)

### Audit Logging

**Immutable Audit Log:**
```
AuditLog {
  id: UUID
  timestamp: DateTime
  userId: UUID
  tenantId: UUID
  action: String (CREATE, UPDATE, DELETE, READ)
  resourceType: String
  resourceId: UUID
  changes: JSONB
  ipAddress: String
  userAgent: String
}
```

**Compliance Retention:**
- GDPR: 1 year
- SOX: 7 years
- Default: 3 years

---

## Observability Stack

### Metrics (Prometheus)

**Application Metrics:**
- Request latency (p50, p95, p99)
- Error rates by service
- Business metrics (risks created, incidents resolved)

**Infrastructure Metrics:**
- CPU, memory, disk usage
- Network I/O
- Database connections

### Logging (Loki/ELK)

**Log Levels:**
- DEBUG: Development
- INFO: Normal operations
- WARN: Recoverable errors
- ERROR: Failures requiring intervention

**Log Retention:**
- Hot: 7 days (Loki)
- Warm: 30 days (S3)
- Cold: 90+ days (Glacier)

### Distributed Tracing (Jaeger/OpenTelemetry)

**Trace Sampling:**
- 100% for errors
- 10% for successful requests
- Configurable per service

**Tracing Scope:**
- Request entry through all services
- Database queries
- External API calls

### Alerting

**Alert Rules:**
```
- API error rate > 1% → Page oncall
- Database latency > 500ms → Alert
- Service down → Page oncall
- Disk usage > 85% → Alert
- Audit log fails → Page security
```

---

## Disaster Recovery

### Backup Strategy

**Frequency:**
- PostgreSQL: Continuous WAL backup
- S3: Daily snapshots
- Kafka: 14-day retention

**Recovery Time Objective (RTO):** 1 hour
**Recovery Point Objective (RPO):** 15 minutes

### Failover

**Database:**
- Automatic failover to replica
- 5-minute detection time

**Services:**
- Pod eviction triggers new pod
- Graceful shutdown (10-second window)
- Connection draining

### Testing

- Monthly DR drill
- Automated backup restoration test
- Failover scenario testing

---

## Compliance & Security Certifications

### SOC2 Type II
- Security controls audit
- Availability monitoring
- Processing integrity checks
- Confidentiality safeguards

### ISO27001
- Information security policy
- Access control
- Incident response
- Risk assessment

### FedRAMP-Ready
- Government deployment model
- Enhanced security controls
- Additional audit logging

---

## Future Enhancements

### AI Infrastructure

**Phase 2:**
- Fine-tuned models for GRC domain
- Local LLM support (Ollama)
- Multi-model support

**Phase 3:**
- RAG optimization
- Prompt engineering
- Custom model training

### Service Mesh

**Phase 2:**
- Istio service mesh
- Advanced traffic management
- mTLS between services

### Data Warehouse

**Phase 3:**
- Data lake (dbt + BigQuery/Snowflake)
- Advanced analytics
- ML integration

---

## Conclusion

OpenRiskOS architecture is designed for:
- **Enterprise Scale:** Millions of users, petabytes of data
- **High Availability:** 99.9% uptime SLA
- **Security:** SOC2, ISO27001, FedRAMP-ready
- **Extensibility:** Plugin system, custom workflows
- **Developer Experience:** Clear APIs, comprehensive docs

The modular, event-driven architecture enables rapid iteration while maintaining stability and security.
