# OpenRiskOS

**The Linux + Salesforce + Datadog of Enterprise Risk Management.**

An open-source, AI-native, enterprise-grade **Integrated Risk Management (IRM)** and **Governance, Risk, Compliance (GRC)** platform.

## Mission

Build a production-grade alternative to Riskconnect, Archer IRM, ServiceNow GRC, MetricStream, LogicGate, and OneTrust that is:

- **Self-hostable** — full control over your data
- **SaaS-capable** — multi-tenant, cloud-ready
- **Enterprise-proven** — battle-tested by top organizations
- **AI-native** — integrated AI copilots throughout
- **Modular** — pick what you need
- **Extensible** — plugin system and marketplaces
- **Modern UX** — feels like Linear, Notion, Datadog combined
- **Open-source** — community-driven core, enterprise-grade features

## What You Can Do

### 1. **Enterprise Risk Management**
- Dynamic risk registers with inherent/residual scoring
- Risk heatmaps, KRI dashboards, Monte Carlo simulations
- Scenario modeling, risk appetite frameworks
- AI-powered risk insights and forecasting

### 2. **Compliance Management**
- Support: ISO 27001, SOC2, HIPAA, GDPR, NIST, PCI-DSS, FedRAMP, SOX, CIS
- Automated evidence collection and attestations
- Compliance gap analysis with AI summaries
- Regulatory change tracking

### 3. **Incident Management**
- Intake → Case Management → Root Cause → CAPA
- Multi-incident type support (operational, cyber, privacy, safety)
- SLA management, escalation workflows, timeline reconstruction
- AI incident summaries and recommendations

### 4. **Third-Party Risk Management**
- Vendor onboarding, assessments, questionnaires
- Continuous monitoring with AI analysis
- Security questionnaire auto-evaluation
- Contract and risk tracking

### 5. **Internal Audit Management**
- Risk-based audit planning
- Workpaper management, findings tracking
- Remediation workflows with AI audit summaries
- Control testing automation

### 6. **Cyber Risk**
- Security risk registers and vulnerability tracking
- Asset inventory, threat intelligence integrations
- Control management with exposure scoring
- Integrations: CrowdStrike, SentinelOne, Splunk, Wiz, Prisma Cloud

### 7. **Business Continuity & Resilience**
- Business impact analysis, recovery planning
- Disaster recovery, crisis management
- Dependency mapping, resilience scoring
- AI recovery recommendations

### 8. **Workflow Automation**
- Drag-and-drop workflow builder
- Trigger/action automations, approval workflows
- BPMN support, event-driven architecture
- SLA enforcement, escalation rules

### 9. **AI Risk Copilot System**
- Natural language querying across all risk domains
- AI-generated reports, summaries, remediation guidance
- RAG-powered risk intelligence
- Risk forecasting and anomaly detection

### 10. **Real-time Analytics**
- Executive dashboards, risk heatmaps, KRI tracking
- Board-level reporting, PDF exports
- Compliance posture dashboards, incident analytics
- AI-powered forecasting

## Tech Stack

**Frontend:**
- Next.js 15 + React + TypeScript
- TailwindCSS + shadcn/ui
- AG Grid, TanStack Query, Zustand
- Framer Motion for animations

**Backend:**
- NestJS microservices
- GraphQL Federation + REST APIs
- OpenAPI specification

**Data:**
- PostgreSQL (primary)
- Prisma ORM
- Redis (caching)
- Neo4j (risk graph)
- OpenSearch (full-text)
- ClickHouse (analytics)

**AI:**
- OpenAI APIs
- Ollama (local LLMs)
- LangChain + LlamaIndex
- pgvector + Qdrant (embeddings)

**Infrastructure:**
- Docker + Kubernetes
- Helm charts
- Terraform (IaC)
- GitHub Actions

**Observability:**
- Prometheus + Grafana
- OpenTelemetry
- Loki (logs)

## Repository Structure

```
openrisks/
├── apps/                          # Applications
│   ├── web/                       # Next.js SaaS dashboard
│   ├── mobile/                    # React Native mobile apps
│   └── cli/                       # Command-line tools
├── services/                      # NestJS microservices
│   ├── api-gateway/
│   ├── risk-service/
│   ├── compliance-service/
│   ├── incident-service/
│   ├── vendor-service/
│   ├── audit-service/
│   ├── workflow-service/
│   ├── ai-service/
│   └── integrations-service/
├── packages/                      # Shared libraries
│   ├── shared-types/              # TypeScript types
│   ├── database/                  # Prisma schemas
│   ├── api-client/                # SDK
│   ├── ui/                        # Component library
│   └── utils/                     # Shared utilities
├── infrastructure/                # Kubernetes manifests
├── terraform/                     # IaC modules
├── k8s/                           # Helm charts
├── sdk/                           # Official SDKs
├── docs/                          # Documentation
├── examples/                      # Integration examples
└── scripts/                       # Automation scripts
```

## Getting Started

### Local Development

```bash
# Clone repository
git clone https://github.com/openrisks/openrisksos.git
cd openrisksos

# Install dependencies
pnpm install

# Start development environment
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Docker Deployment

```bash
docker-compose up
```

### Kubernetes Deployment

```bash
helm install openrisks ./k8s/openrisks
```

## Open-Core Model

**Open Source:**
- Core GRC platform
- Workflow engine
- REST + GraphQL APIs
- Integration SDKs
- Plugin system

**Enterprise:**
- Advanced AI analytics
- Enterprise compliance packs
- Managed SaaS hosting
- Advanced integrations (100+)
- Premium support
- Custom workflows
- White-labeling

## Security

- SOC2 Type II ready
- ISO27001 compliance
- FedRAMP-ready architecture
- Encryption at rest + in transit
- Fine-grained RBAC/ABAC
- Immutable audit logs
- SIEM integrations
- Real-time security monitoring

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

We welcome:
- Bug reports
- Feature requests
- Code contributions
- Documentation improvements
- Integration plugins

## License

**Core platform:** AGPL-3.0
**Enterprise packages:** Commercial

## Support

- **Community:** GitHub Discussions
- **Enterprise:** support@openrisks.io
- **Docs:** https://docs.openrisks.io
- **Status:** https://status.openrisks.io

---

**Built by enterprise engineers for enterprise engineers.**

*The future of risk management is open, intelligent, and in your hands.*
