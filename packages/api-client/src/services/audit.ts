import { BaseApiClient } from '../base';

export interface Audit {
  id: string;
  tenantId: string;
  title: string;
  type: string;
  scope: string;
  status: string;
  scheduledDate: string;
  plannedEndDate?: string;
  planner: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditFinding {
  id: string;
  auditId: string;
  title: string;
  description?: string;
  severity: string;
  status: string;
  dueDate: string;
  createdAt: string;
}

export interface AuditEvidence {
  id: string;
  findingId: string;
  title: string;
  type: string;
  description?: string;
  url?: string;
  createdAt: string;
}

export interface CreateAuditDto {
  title: string;
  type: string;
  scope: string;
  scheduledDate: string;
  plannedEndDate?: string;
  assignedTo: string;
}

export interface CreateFindingDto {
  auditId: string;
  title: string;
  description?: string;
  severity: string;
  dueDate: string;
}

export interface CreateEvidenceDto {
  findingId: string;
  title: string;
  type: string;
  description?: string;
  url?: string;
}

export class AuditService extends BaseApiClient {
  constructor(baseURL: string, tenantId: string, token?: string) {
    super({
      baseURL,
      tenantId,
      token,
    });
  }

  /**
   * Create an audit
   */
  async createAudit(data: CreateAuditDto): Promise<Audit> {
    return this.post<Audit>('/api/v1/audits', data);
  }

  /**
   * Get all audits
   */
  async getAudits(filters?: {
    status?: string;
    type?: string;
    skip?: number;
    take?: number;
  }): Promise<Audit[]> {
    return this.get<Audit[]>('/api/v1/audits', filters);
  }

  /**
   * Get a specific audit
   */
  async getAudit(id: string): Promise<Audit> {
    return this.get<Audit>(`/api/v1/audits/${id}`);
  }

  /**
   * Update an audit
   */
  async updateAudit(id: string, data: Partial<CreateAuditDto>): Promise<Audit> {
    return this.put<Audit>(`/api/v1/audits/${id}`, data);
  }

  /**
   * Update audit status
   */
  async updateAuditStatus(id: string, status: string): Promise<Audit> {
    return this.put<Audit>(`/api/v1/audits/${id}/status`, { status });
  }

  /**
   * Delete an audit
   */
  async deleteAudit(id: string): Promise<void> {
    await this.delete(`/api/v1/audits/${id}`);
  }

  /**
   * Create a finding
   */
  async createFinding(data: CreateFindingDto): Promise<AuditFinding> {
    return this.post<AuditFinding>('/api/v1/audits/findings', data);
  }

  /**
   * Get findings for audit
   */
  async getAuditFindings(auditId: string): Promise<AuditFinding[]> {
    return this.get<AuditFinding[]>(`/api/v1/audits/${auditId}/findings`);
  }

  /**
   * Get all findings
   */
  async getFindings(): Promise<AuditFinding[]> {
    return this.get<AuditFinding[]>('/api/v1/audits/findings');
  }

  /**
   * Get a specific finding
   */
  async getFinding(id: string): Promise<AuditFinding> {
    return this.get<AuditFinding>(`/api/v1/audits/findings/${id}`);
  }

  /**
   * Update finding status
   */
  async updateFindingStatus(id: string, status: string): Promise<AuditFinding> {
    return this.put<AuditFinding>(`/api/v1/audits/findings/${id}/status`, { status });
  }

  /**
   * Delete a finding
   */
  async deleteFinding(id: string): Promise<void> {
    await this.delete(`/api/v1/audits/findings/${id}`);
  }

  /**
   * Create evidence for finding
   */
  async createEvidence(data: CreateEvidenceDto): Promise<AuditEvidence> {
    return this.post<AuditEvidence>('/api/v1/audits/evidence', data);
  }

  /**
   * Get evidence for finding
   */
  async getFindingEvidence(findingId: string): Promise<AuditEvidence[]> {
    return this.get<AuditEvidence[]>(`/api/v1/audits/findings/${findingId}/evidence`);
  }

  /**
   * Delete evidence
   */
  async deleteEvidence(id: string): Promise<void> {
    await this.delete(`/api/v1/audits/evidence/${id}`);
  }

  /**
   * Get audit statistics
   */
  async getAuditStats(): Promise<{
    total: number;
    bySeverity: Record<string, number>;
    byStatus: Record<string, number>;
    openFindings: number;
    avgClosureTime: number;
  }> {
    return this.get('/api/v1/audits/statistics');
  }

  /**
   * Get open findings
   */
  async getOpenFindings(): Promise<AuditFinding[]> {
    const findings = await this.getFindings();
    return findings.filter((f) => f.status === 'OPEN');
  }

  /**
   * Get critical findings
   */
  async getCriticalFindings(): Promise<AuditFinding[]> {
    const findings = await this.getFindings();
    return findings.filter((f) => f.severity === 'CRITICAL');
  }
}
