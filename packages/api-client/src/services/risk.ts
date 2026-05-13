import { BaseApiClient, ApiClientConfig } from '../base';

export interface Risk {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  riskCategory: string;
  status: string;
  probability: number;
  inherentImpact: number;
  inherentScore: number;
  mitigationEffectiveness: number;
  residualScore: number;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRiskDto {
  title: string;
  description?: string;
  riskCategory: string;
  probability: number;
  impact: number;
  mitigationEffectiveness?: number;
}

export interface UpdateRiskDto {
  title?: string;
  description?: string;
  status?: string;
  probability?: number;
  impact?: number;
  mitigationEffectiveness?: number;
}

export interface RiskFilter {
  status?: string;
  riskCategory?: string;
  minScore?: number;
  maxScore?: number;
  skip?: number;
  take?: number;
  search?: string;
}

export class RiskService extends BaseApiClient {
  constructor(baseURL: string, tenantId: string, token?: string) {
    super({
      baseURL,
      tenantId,
      token,
    });
  }

  /**
   * Create a new risk
   */
  async createRisk(data: CreateRiskDto): Promise<Risk> {
    return this.post<Risk>('/api/v1/risks', data);
  }

  /**
   * Get all risks with optional filtering
   */
  async getRisks(filter?: RiskFilter): Promise<Risk[]> {
    return this.get<Risk[]>('/api/v1/risks', filter);
  }

  /**
   * Get a specific risk by ID
   */
  async getRisk(id: string): Promise<Risk> {
    return this.get<Risk>(`/api/v1/risks/${id}`);
  }

  /**
   * Update a risk
   */
  async updateRisk(id: string, data: UpdateRiskDto): Promise<Risk> {
    return this.put<Risk>(`/api/v1/risks/${id}`, data);
  }

  /**
   * Delete a risk (soft delete)
   */
  async deleteRisk(id: string): Promise<Risk> {
    return this.delete<Risk>(`/api/v1/risks/${id}`);
  }

  /**
   * Get risk heatmap (5x5 probability-impact matrix)
   */
  async getRiskHeatmap(): Promise<{
    matrix: number[][];
    totalRisks: number;
    criticalCount: number;
  }> {
    return this.get('/api/v1/risks/heatmap');
  }

  /**
   * Get risk statistics
   */
  async getRiskStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
    avgScore: number;
  }> {
    return this.get('/api/v1/risks/statistics');
  }

  /**
   * Get risks by owner
   */
  async getRisksByOwner(ownerId: string): Promise<Risk[]> {
    return this.get<Risk[]>(`/api/v1/risks/owner/${ownerId}`);
  }

  /**
   * Get high-risk items (critical and high severity)
   */
  async getHighRisks(): Promise<Risk[]> {
    return this.getRisks({ minScore: 15 });
  }

  /**
   * Update risk status
   */
  async updateRiskStatus(id: string, status: string): Promise<Risk> {
    return this.put<Risk>(`/api/v1/risks/${id}/status`, { status });
  }

  /**
   * Add mitigation to risk
   */
  async addMitigation(
    riskId: string,
    mitigation: {
      title: string;
      description?: string;
      effectiveness: number;
    }
  ): Promise<Risk> {
    return this.post(`/api/v1/risks/${riskId}/mitigations`, mitigation);
  }

  /**
   * Add control to risk
   */
  async addControl(
    riskId: string,
    control: {
      title: string;
      description?: string;
    }
  ): Promise<Risk> {
    return this.post(`/api/v1/risks/${riskId}/controls`, control);
  }
}
