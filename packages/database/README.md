# OpenRiskOS Database

PostgreSQL database schema and migrations for OpenRiskOS using Prisma ORM.

## Database Models

### Core Entities

#### Tenancy & Multi-tenant Support
- **Tenant**: Represents an organization/customer
  - Fields: name, slug, description, logo, status, tier
  - Relations: owns all data (users, risks, incidents, audits, vendors, etc.)

#### Authentication & Users
- **User**: System users within a tenant
  - Fields: email, name, avatar, role, status, permissions
  - Roles: admin, user, auditor, viewer
  - Multi-factor authentication support

#### Enterprise Risk Management
- **Risk**: Risk registers with scoring
  - Probability (1-5) × Impact (1-5) = Inherent Score
  - Mitigation effectiveness reduces to Residual Score
  - Categories: strategic, operational, compliance, financial, cyber, reputational
  - Relations: owner (User), mitigations, controls

- **RiskMitigation**: Mitigation strategies for risks
  - Tracks effectiveness percentage
  - Assigned to owners
  - Progress tracking

- **RiskControl**: Controls applied to risks
  - Test results tracking
  - Effectiveness monitoring
  - Evidence collection

#### Compliance Management
- **ComplianceFramework**: Regulatory frameworks
  - Types: ISO27001, NIST, SOC2, HIPAA, GDPR, PCI_DSS, COBIT, CUSTOM
  - Tracks total controls and compliance percentage

- **ComplianceControl**: Individual controls within frameworks
  - Status: NOT_STARTED, IN_PROGRESS, COMPLIANT, NON_COMPLIANT, NOT_APPLICABLE
  - Evidence association
  - Test tracking

- **Evidence**: Supporting documentation
  - Types: INTERVIEW, OBSERVATION, DOCUMENT, TEST_RESULT, WALKTHROUGH, SAMPLING, SYSTEM_OUTPUT, OTHER
  - File attachments
  - Multiple relations (framework, control, audit)

#### Incident Management
- **Incident**: Security and operational incidents
  - Types: SECURITY, DATA_BREACH, SYSTEM_OUTAGE, COMPLIANCE, OPERATIONAL, POLICY_VIOLATION, FRAUD, OTHER
  - Severity: CRITICAL, HIGH, MEDIUM, LOW, INFO
  - Status: OPEN, INVESTIGATING, CONTAINMENT, RESOLVED, CLOSED, REOPENED
  - Affected records tracking

- **IncidentTimeline**: Timeline events for incidents
  - Event types: DETECTION, ESCALATION, INVESTIGATION, CONTAINMENT, ERADICATION, RECOVERY, COMMUNICATION, RESOLUTION, CLOSURE, COMMENT
  - Tracks progression through incident lifecycle

- **CorrectiveAction**: Actions to remediate incidents
  - Types: IMMEDIATE, CORRECTIVE, PREVENTIVE
  - Status: OPEN, IN_PROGRESS, COMPLETED, CANCELLED, OVERDUE
  - Due date tracking

#### Audit Management
- **Audit**: Audit engagements
  - Types: INTERNAL, EXTERNAL, COMPLIANCE, IT, OPERATIONAL, FINANCIAL, SPECIAL
  - Status: PLANNED, SCHEDULED, IN_PROGRESS, DRAFT_REPORT, REPORT_ISSUED, CLOSED
  - Scope and resource tracking

- **AuditFinding**: Issues discovered during audits
  - Severity: CRITICAL, MAJOR, MINOR, OBSERVATION
  - Status: OPEN, IN_REMEDIATION, REMEDIATED, CLOSED, DEFERRED
  - Due date and responsibility tracking

- **AuditEvidence**: Evidence collected during audits
  - Types: INTERVIEW, OBSERVATION, DOCUMENT, TEST_RESULT, WALKTHROUGH, SAMPLING, SYSTEM_OUTPUT, OTHER

#### Vendor Management
- **Vendor**: Third-party vendors and suppliers
  - Classification: CRITICAL, HIGH, MEDIUM, LOW
  - Status: ACTIVE, INACTIVE, UNDER_REVIEW, SUSPENDED, TERMINATED
  - Risk score (0-50)
  - Last assessment and next review dates

- **VendorAssessment**: Assessment results
  - Types: SECURITY_QUESTIONNAIRE, AUDIT_REPORT, SOC2_REPORT, PENETRATION_TEST, VULNERABILITY_SCAN, COMPLIANCE_ASSESSMENT, ONSITE_AUDIT, SELF_ASSESSMENT
  - Status: PENDING, IN_PROGRESS, COMPLETED, FAILED

- **VendorBreach**: Security breach incidents at vendors
  - Severity: CRITICAL, HIGH, MEDIUM, LOW
  - Status: REPORTED, INVESTIGATING, CONTAINED, RESOLVED
  - Affected records tracking

#### Governance & Policies
- **Policy**: Organization policies
  - Categories: security, compliance, operational, data-protection, incident-response
  - Version tracking
  - Acknowledgment tracking

- **Workflow**: Automated workflows
  - Triggers and actions
  - Step definitions
  - Condition-based routing

- **Dashboard**: User-customized dashboards
  - Widgets and layout
  - Filters and time ranges
  - Sharing settings

## Schema Structure

```
┌─────────────┐
│   Tenant    │ (Root entity)
└──────┬──────┘
       │
       ├── User (Auth)
       ├── Risk (ERM)
       │   ├── RiskMitigation
       │   └── RiskControl
       ├── ComplianceFramework (Compliance)
       │   ├── ComplianceControl
       │   └── Evidence
       ├── Incident (Incident Management)
       │   ├── IncidentTimeline
       │   └── CorrectiveAction
       ├── Audit (Audit)
       │   ├── AuditFinding
       │   └── AuditEvidence
       ├── Vendor (Third-party Risk)
       │   ├── VendorAssessment
       │   └── VendorBreach
       ├── Policy (Governance)
       ├── Workflow (Automation)
       │   └── WorkflowInstance
       └── Dashboard (Customization)
```

## Database Setup

### Prerequisites

- PostgreSQL 14+ (16+ recommended)
- Node.js 20+
- pnpm or npm

### Installation

```bash
# Install dependencies
npm install

# or
pnpm install
```

### Environment Setup

```bash
# Copy example file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

### .env Configuration

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/openriskos"

# Optional: Shadow database for development (Prisma)
SHADOW_DATABASE_URL="postgresql://user:password@localhost:5432/openriskos_shadow"
```

### Creating the Database

```bash
# Create database using PostgreSQL
createdb openriskos

# Or via Docker
docker run --name postgres -e POSTGRES_DB=openriskos -d postgres:16
```

### Running Migrations

```bash
# Apply all pending migrations
npm run db:migrate

# Create a new migration (after schema changes)
npm run db:migrate:create -- --name <migration_name>

# Push schema to database (development only)
npm run db:push
```

### Database Seeding

```bash
# Run seed script to populate test data
npm run db:seed
```

This creates:
- 1 test tenant (Acme Corporation)
- 4 users (admin, CISO, auditor, compliance officer)
- 3 compliance frameworks (ISO 27001, GDPR, HIPAA)
- 3 compliance controls
- 3 risks
- 2 incidents
- 2 audits with findings
- 2 vendors with assessments

### Prisma Studio

```bash
# Open web UI for database inspection and editing
npm run db:studio
```

Accessible at `http://localhost:5555`

## Migration Strategy

### Development Migrations

```bash
# Make schema changes in schema.prisma

# Create migration
npm run db:migrate:create -- --name add_new_field

# Review generated migration in migrations/{timestamp}_add_new_field/migration.sql

# Apply migration
npm run db:migrate
```

### Production Migrations

1. **Plan**: Review changes with team
2. **Test**: Run against staging database
3. **Backup**: Backup production database
4. **Execute**: Run migration during maintenance window
5. **Verify**: Confirm data integrity

```bash
# Run migration in production
npm run db:migrate
```

## Prisma Commands

### Development
```bash
npm run db:push        # Push schema without creating migrations
npm run db:migrate     # Apply migrations
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Seed database with test data
```

### Inspection
```bash
# Generate Prisma client
npx prisma generate

# Validate schema
npx prisma validate

# Format schema
npx prisma format
```

## Performance Optimization

### Indexes

Key indexes are defined on:
- `Tenant.slug` - Fast tenant lookups
- `User.tenantId, User.email` - User authentication
- `Risk.tenantId` - Risk filtering
- `Incident.tenantId, Incident.status` - Incident queries
- `Audit.tenantId, Audit.status` - Audit queries

### Connection Pooling

Use connection pooling in production:

```env
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public&connection_limit=10"
```

### Query Optimization

- Use selective fields: `.select()` instead of full model
- Batch queries with Promise.all()
- Use include sparingly: lazy load relations
- Implement pagination for large result sets

## Data Integrity

### Constraints

- Tenant isolation: `tenantId` on all records
- Unique constraints: User email per tenant
- Foreign key constraints: Referential integrity
- Soft deletes: `deletedAt` field on key models

### Transactions

```typescript
await prisma.$transaction([
  prisma.risk.update({ ... }),
  prisma.riskMitigation.create({ ... }),
]);
```

## Backup & Recovery

### PostgreSQL Backups

```bash
# Full backup
pg_dump openriskos > backup.sql

# Restore from backup
psql openriskos < backup.sql

# Using Docker
docker exec postgres pg_dump -U postgres openriskos > backup.sql
```

### Point-in-Time Recovery

Enable WAL (Write-Ahead Logging) for PITR:

```sql
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
```

## Multi-Tenancy

### Tenant Isolation

All queries automatically filter by `tenantId`:

```typescript
// Automatically scoped to tenant
const risks = await prisma.risk.findMany({
  where: {
    tenantId: 'tenant-123',
  },
});
```

### Cross-Tenant Queries

Avoid selecting across tenants. Each request must include tenant context:

```typescript
// ✓ Good: Filtered by tenant
const data = await prisma.risk.findMany({
  where: { tenantId },
});

// ✗ Bad: No tenant filter
const data = await prisma.risk.findMany();
```

## Monitoring

### Query Performance

Enable query logging:

```env
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public&log_queries=true"
```

### Connection Monitoring

```sql
-- Active connections
SELECT * FROM pg_stat_activity;

-- Connection count
SELECT COUNT(*) FROM pg_stat_activity;
```

## Troubleshooting

### Connection Issues

```bash
# Test connection
psql -h localhost -U postgres -d openriskos

# Check environment variables
echo $DATABASE_URL
```

### Migration Conflicts

```bash
# Reset database (development only!)
npm run db:push -- --force-reset

# Resolve conflicts
npm run db:migrate:status
```

### Performance Issues

```bash
# Analyze query plans
EXPLAIN ANALYZE SELECT * FROM "Risk" WHERE tenantId = 'xyz';

# Check index usage
SELECT * FROM pg_stat_user_indexes;
```

## Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Database Schema](./prisma/schema.prisma)

## Best Practices

1. **Always use transactions** for multi-record updates
2. **Implement soft deletes** instead of hard deletes
3. **Use audit tables** for compliance tracking
4. **Regular backups** - daily for production
5. **Monitor query performance** - identify slow queries
6. **Validate at application layer** in addition to database
7. **Use connection pooling** in production
8. **Test migrations** in staging environment first

## Contributing

When adding new models:
1. Add model to `schema.prisma`
2. Create migration: `npm run db:migrate:create`
3. Update seeding script with test data
4. Add indexes for commonly filtered fields
5. Update this README

## License

Part of OpenRiskOS - Enterprise GRC Platform
