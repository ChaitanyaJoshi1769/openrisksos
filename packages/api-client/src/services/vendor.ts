import { BaseApiClient } from '../base';

export interface Vendor {
  id: string;
  tenantId: string;
  name: string;
  classification: string;
  status: string;
  riskScore: number;
  description?: string;
  manager: string;
  lastAssessmentDate?: string;
  nextReviewDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorAssessment {
  id: string;
  vendorId: string;
  type: string;
  date: string;
  status: string;
  assessor: string;
  findings?: string;
  createdAt: string;
}

export interface VendorBreach {
  id: string;
  vendorId: string;
  title: string;
  description?: string;
  severity: string;
  status: string;
  reportedDate: string;
  affectedRecords: number;
  createdAt: string;
}

export interface CreateVendorDto {
  name: string;
  classification: string;
  description?: string;
  manager: string;
}

export interface CreateAssessmentDto {
  vendorId: string;
  type: string;
  date: string;
  assessor: string;
  findings?: string;
}

export interface CreateBreachDto {
  vendorId: string;
  title: string;
  description?: string;
  severity: string;
  affectedRecords: number;
}

export class VendorService extends BaseApiClient {
  constructor(baseURL: string, tenantId: string, token?: string) {
    super({
      baseURL,
      tenantId,
      token,
    });
  }

  /**
   * Create a vendor
   */
  async createVendor(data: CreateVendorDto): Promise<Vendor> {
    return this.post<Vendor>('/api/v1/vendors', data);
  }

  /**
   * Get all vendors
   */
  async getVendors(filters?: {
    classification?: string;
    status?: string;
    skip?: number;
    take?: number;
  }): Promise<Vendor[]> {
    return this.get<Vendor[]>('/api/v1/vendors', filters);
  }

  /**
   * Get a specific vendor
   */
  async getVendor(id: string): Promise<Vendor> {
    return this.get<Vendor>(`/api/v1/vendors/${id}`);
  }

  /**
   * Update a vendor
   */
  async updateVendor(id: string, data: Partial<CreateVendorDto>): Promise<Vendor> {
    return this.put<Vendor>(`/api/v1/vendors/${id}`, data);
  }

  /**
   * Update vendor status
   */
  async updateVendorStatus(id: string, status: string): Promise<Vendor> {
    return this.put<Vendor>(`/api/v1/vendors/${id}/status`, { status });
  }

  /**
   * Update vendor risk score
   */
  async updateRiskScore(id: string, riskScore: number): Promise<Vendor> {
    return this.put<Vendor>(`/api/v1/vendors/${id}/risk-score`, { riskScore });
  }

  /**
   * Delete a vendor
   */
  async deleteVendor(id: string): Promise<void> {
    await this.delete(`/api/v1/vendors/${id}`);
  }

  /**
   * Create assessment
   */
  async createAssessment(data: CreateAssessmentDto): Promise<VendorAssessment> {
    return this.post<VendorAssessment>('/api/v1/vendors/assessments', data);
  }

  /**
   * Get assessments for vendor
   */
  async getVendorAssessments(vendorId: string): Promise<VendorAssessment[]> {
    return this.get<VendorAssessment[]>(`/api/v1/vendors/${vendorId}/assessments`);
  }

  /**
   * Get all assessments
   */
  async getAssessments(): Promise<VendorAssessment[]> {
    return this.get<VendorAssessment[]>('/api/v1/vendors/assessments');
  }

  /**
   * Delete assessment
   */
  async deleteAssessment(id: string): Promise<void> {
    await this.delete(`/api/v1/vendors/assessments/${id}`);
  }

  /**
   * Report breach
   */
  async reportBreach(data: CreateBreachDto): Promise<VendorBreach> {
    return this.post<VendorBreach>('/api/v1/vendors/breaches', data);
  }

  /**
   * Get breaches for vendor
   */
  async getVendorBreaches(vendorId: string): Promise<VendorBreach[]> {
    return this.get<VendorBreach[]>(`/api/v1/vendors/${vendorId}/breaches`);
  }

  /**
   * Get all breaches
   */
  async getBreaches(): Promise<VendorBreach[]> {
    return this.get<VendorBreach[]>('/api/v1/vendors/breaches');
  }

  /**
   * Update breach status
   */
  async updateBreachStatus(id: string, status: string): Promise<VendorBreach> {
    return this.put<VendorBreach>(`/api/v1/vendors/breaches/${id}/status`, { status });
  }

  /**
   * Get vendor statistics
   */
  async getVendorStats(): Promise<{
    total: number;
    byClassification: Record<string, number>;
    byStatus: Record<string, number>;
    criticalRiskCount: number;
    avgRiskScore: number;
  }> {
    return this.get('/api/v1/vendors/statistics');
  }

  /**
   * Get critical vendors
   */
  async getCriticalVendors(): Promise<Vendor[]> {
    return this.getVendors({ classification: 'CRITICAL' });
  }

  /**
   * Get vendors with recent breaches
   */
  async getVendorsWithBreaches(): Promise<Vendor[]> {
    const vendors = await this.getVendors();
    const breaches = await this.getBreaches();
    const vendorIdsWithBreaches = new Set(breaches.map((b) => b.vendorId));
    return vendors.filter((v) => vendorIdsWithBreaches.has(v.id));
  }

  /**
   * Get vendors needing assessment
   */
  async getVendorsNeedingAssessment(): Promise<Vendor[]> {
    const vendors = await this.getVendors();
    const now = new Date();
    return vendors.filter((v) => {
      if (!v.nextReviewDate) return true;
      return new Date(v.nextReviewDate) <= now;
    });
  }
}
