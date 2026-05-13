// Base client
export { BaseApiClient, ApiClientConfig, ApiResponse, ApiError } from './base';

// Risk Service
export {
  Risk,
  CreateRiskDto,
  UpdateRiskDto,
  RiskFilter,
  RiskService,
} from './services/risk';

// Compliance Service
export {
  ComplianceFramework,
  ComplianceControl,
  Evidence,
  CreateFrameworkDto,
  CreateControlDto,
  CreateEvidenceDto,
  ComplianceService,
} from './services/compliance';

// Incident Service
export {
  Incident,
  CreateIncidentDto,
  UpdateIncidentDto,
  IncidentTimeline,
  CreateTimelineDto,
  CorrectiveAction,
  CreateCorrectiveActionDto,
  IncidentService,
} from './services/incident';

// Audit Service
export {
  Audit,
  AuditFinding,
  AuditEvidence,
  CreateAuditDto,
  CreateFindingDto,
  CreateEvidenceDto as CreateAuditEvidenceDto,
  AuditService,
} from './services/audit';

// Vendor Service
export {
  Vendor,
  VendorAssessment,
  VendorBreach,
  CreateVendorDto,
  CreateAssessmentDto,
  CreateBreachDto,
  VendorService,
} from './services/vendor';

/**
 * OpenRiskOS API Client Factory
 *
 * Usage:
 * const client = new OpenRiskOSClient({
 *   gatewayURL: 'http://localhost:3000',
 *   tenantId: 'tenant-123',
 *   token: 'jwt-token'
 * });
 *
 * const risks = await client.risk.getRisks();
 */
export class OpenRiskOSClient {
  public risk: RiskService;
  public compliance: ComplianceService;
  public incident: IncidentService;
  public audit: AuditService;
  public vendor: VendorService;

  constructor(config: {
    gatewayURL: string;
    tenantId: string;
    token?: string;
  }) {
    // Service URLs default to gateway routing
    const serviceURL = config.gatewayURL;

    this.risk = new RiskService(serviceURL, config.tenantId, config.token);
    this.compliance = new ComplianceService(serviceURL, config.tenantId, config.token);
    this.incident = new IncidentService(serviceURL, config.tenantId, config.token);
    this.audit = new AuditService(serviceURL, config.tenantId, config.token);
    this.vendor = new VendorService(serviceURL, config.tenantId, config.token);
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.risk.setToken(token);
    this.compliance.setToken(token);
    this.incident.setToken(token);
    this.audit.setToken(token);
    this.vendor.setToken(token);
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.risk.clearToken();
    this.compliance.clearToken();
    this.incident.clearToken();
    this.audit.clearToken();
    this.vendor.clearToken();
  }

  /**
   * Change tenant context
   */
  setTenantId(tenantId: string): void {
    this.risk.setTenantId(tenantId);
    this.compliance.setTenantId(tenantId);
    this.incident.setTenantId(tenantId);
    this.audit.setTenantId(tenantId);
    this.vendor.setTenantId(tenantId);
  }
}
