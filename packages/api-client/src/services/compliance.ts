import { BaseApiClient } from '../base';

export interface ComplianceFramework {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  description?: string;
  status: string;
  totalControls: number;
  compliancePercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceControl {
  id: string;
  tenantId: string;
  frameworkId: string;
  title: string;
  description?: string;
  status: string;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  id: string;
  tenantId: string;
  title: string;
  type: string;
  description?: string;
  url?: string;
  createdAt: string;
}

export interface CreateFrameworkDto {
  name: string;
  type: string;
  description?: string;
  totalControls: number;
}

export interface CreateControlDto {
  frameworkId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
}

export interface CreateEvidenceDto {
  title: string;
  type: string;
  description?: string;
  url?: string;
}

export class ComplianceService extends BaseApiClient {
  constructor(baseURL: string, tenantId: string, token?: string) {
    super({
      baseURL,
      tenantId,
      token,
    });
  }

  /**
   * Create a compliance framework
   */
  async createFramework(data: CreateFrameworkDto): Promise<ComplianceFramework> {
    return this.post<ComplianceFramework>('/api/v1/compliance/frameworks', data);
  }

  /**
   * Get all compliance frameworks
   */
  async getFrameworks(): Promise<ComplianceFramework[]> {
    return this.get<ComplianceFramework[]>('/api/v1/compliance/frameworks');
  }

  /**
   * Get a specific framework
   */
  async getFramework(id: string): Promise<ComplianceFramework> {
    return this.get<ComplianceFramework>(`/api/v1/compliance/frameworks/${id}`);
  }

  /**
   * Update a framework
   */
  async updateFramework(id: string, data: Partial<CreateFrameworkDto>): Promise<ComplianceFramework> {
    return this.put<ComplianceFramework>(`/api/v1/compliance/frameworks/${id}`, data);
  }

  /**
   * Delete a framework
   */
  async deleteFramework(id: string): Promise<void> {
    await this.delete(`/api/v1/compliance/frameworks/${id}`);
  }

  /**
   * Create a compliance control
   */
  async createControl(data: CreateControlDto): Promise<ComplianceControl> {
    return this.post<ComplianceControl>('/api/v1/compliance/controls', data);
  }

  /**
   * Get controls for a framework
   */
  async getFrameworkControls(frameworkId: string): Promise<ComplianceControl[]> {
    return this.get<ComplianceControl[]>('/api/v1/compliance/controls', { frameworkId });
  }

  /**
   * Get all controls
   */
  async getControls(): Promise<ComplianceControl[]> {
    return this.get<ComplianceControl[]>('/api/v1/compliance/controls');
  }

  /**
   * Get a specific control
   */
  async getControl(id: string): Promise<ComplianceControl> {
    return this.get<ComplianceControl>(`/api/v1/compliance/controls/${id}`);
  }

  /**
   * Update a control
   */
  async updateControl(id: string, data: Partial<CreateControlDto>): Promise<ComplianceControl> {
    return this.put<ComplianceControl>(`/api/v1/compliance/controls/${id}`, data);
  }

  /**
   * Update control status
   */
  async updateControlStatus(id: string, status: string): Promise<ComplianceControl> {
    return this.put<ComplianceControl>(`/api/v1/compliance/controls/${id}/status`, { status });
  }

  /**
   * Delete a control
   */
  async deleteControl(id: string): Promise<void> {
    await this.delete(`/api/v1/compliance/controls/${id}`);
  }

  /**
   * Create evidence
   */
  async createEvidence(data: CreateEvidenceDto): Promise<Evidence> {
    return this.post<Evidence>('/api/v1/compliance/evidence', data);
  }

  /**
   * Get evidence for a control
   */
  async getControlEvidence(controlId: string): Promise<Evidence[]> {
    return this.get<Evidence[]>(`/api/v1/compliance/controls/${controlId}/evidence`);
  }

  /**
   * Get all evidence
   */
  async getEvidence(): Promise<Evidence[]> {
    return this.get<Evidence[]>('/api/v1/compliance/evidence');
  }

  /**
   * Delete evidence
   */
  async deleteEvidence(id: string): Promise<void> {
    await this.delete(`/api/v1/compliance/evidence/${id}`);
  }

  /**
   * Get overall compliance status
   */
  async getComplianceStatus(): Promise<{
    overallScore: number;
    byFramework: Record<string, number>;
    nonCompliantControls: ComplianceControl[];
  }> {
    return this.get('/api/v1/compliance/status');
  }

  /**
   * Get non-compliant controls
   */
  async getNonCompliantControls(): Promise<ComplianceControl[]> {
    return this.get<ComplianceControl[]>('/api/v1/compliance/controls', {
      status: 'NON_COMPLIANT',
    });
  }

  /**
   * Get compliance score for framework
   */
  async getFrameworkComplianceScore(frameworkId: string): Promise<number> {
    const framework = await this.getFramework(frameworkId);
    return framework.compliancePercentage;
  }
}
