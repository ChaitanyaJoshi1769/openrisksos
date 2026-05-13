# Vendor Service

**Enterprise Third-Party Risk Management Microservice** for OpenRiskOS.

This service handles vendor/third-party management, vendor assessments, breach tracking, and vendor risk scoring.

## Features

- **Vendor Management:** Manage vendors, classifications, and risk profiles
- **Assessment Tracking:** Security questionnaires, audits, penetration tests, SOC2 reports
- **Breach Management:** Track and manage vendor breaches and incidents
- **Risk Scoring:** Dynamic risk scoring based on assessments and breaches
- **Vendor Analytics:** Risk statistics, assessment history, breach tracking
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

## Setup

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm dev
```

## API Endpoints

### Vendors
- `POST /api/v1/vendors` - Create vendor
- `GET /api/v1/vendors` - List vendors
- `GET /api/v1/vendors/:id` - Get vendor details
- `PUT /api/v1/vendors/:id` - Update vendor
- `PUT /api/v1/vendors/:id/status` - Update status
- `DELETE /api/v1/vendors/:id` - Delete vendor

### Assessments
- `POST /api/v1/vendors/:vendorId/assessments` - Create assessment
- `GET /api/v1/vendors/:vendorId/assessments` - Get assessments
- `PUT /api/v1/assessments/:id` - Update assessment
- `DELETE /api/v1/assessments/:id` - Delete assessment

### Breaches
- `POST /api/v1/vendors/:vendorId/breaches` - Create breach
- `GET /api/v1/vendors/:vendorId/breaches` - Get breaches
- `PUT /api/v1/breaches/:id` - Update breach
- `DELETE /api/v1/breaches/:id` - Delete breach

### Analytics
- `GET /api/v1/vendors/:vendorId/risk-profile` - Get vendor risk profile
- `GET /api/v1/vendors/analytics/stats` - Get risk statistics
- `GET /api/v1/vendors/analytics/overdue-assessments` - Get vendors needing assessment

## Vendor Classifications

- **CRITICAL** - Critical vendor (data, core systems)
- **HIGH** - High risk vendor
- **MEDIUM** - Medium risk vendor
- **LOW** - Low risk vendor

## Assessment Types

- SECURITY_QUESTIONNAIRE, AUDIT_REPORT, SOC2_REPORT
- PENETRATION_TEST, VULNERABILITY_SCAN, COMPLIANCE_ASSESSMENT
- ONSITE_AUDIT, SELF_ASSESSMENT

## License

AGPL-3.0 (see [LICENSE](../../LICENSE))

---

**Status:** 🚀 **In Development**  
**Version:** 0.1.0  
**Maintainer:** OpenRiskOS Team
