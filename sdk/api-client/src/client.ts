import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { GraphQLClient } from 'graphql-request';

export interface OpenRiskOSClientConfig {
  apiUrl: string;
  graphqlUrl?: string;
  apiKey?: string;
  token?: string;
  timeout?: number;
}

export class OpenRiskOSClient {
  private apiClient: AxiosInstance;
  private graphqlClient: GraphQLClient;
  private config: OpenRiskOSClientConfig;

  constructor(config: OpenRiskOSClientConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };

    // Initialize Axios client for REST API
    this.apiClient = axios.create({
      baseURL: this.config.apiUrl,
      timeout: this.config.timeout,
      headers: this._getHeaders(),
    });

    // Initialize GraphQL client
    const graphqlUrl = this.config.graphqlUrl || `${this.config.apiUrl}/graphql`;
    this.graphqlClient = new GraphQLClient(graphqlUrl, {
      headers: this._getHeaders(),
    });
  }

  private _getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
    }

    if (this.config.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`;
    }

    return headers;
  }

  // ============================================================
  // RISK MANAGEMENT ENDPOINTS
  // ============================================================

  async getRisks(tenantId: string, filters?: Record<string, any>) {
    return this.apiClient.get('/risks', {
      params: filters,
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async getRisk(tenantId: string, riskId: string) {
    return this.apiClient.get(`/risks/${riskId}`, {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async createRisk(tenantId: string, data: any) {
    return this.apiClient.post('/risks', data, {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async updateRisk(tenantId: string, riskId: string, data: any) {
    return this.apiClient.put(`/risks/${riskId}`, data, {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async deleteRisk(tenantId: string, riskId: string) {
    return this.apiClient.delete(`/risks/${riskId}`, {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  // ============================================================
  // COMPLIANCE ENDPOINTS
  // ============================================================

  async getFrameworks(tenantId: string) {
    return this.apiClient.get('/compliance/frameworks', {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async getControls(tenantId: string, frameworkId?: string) {
    return this.apiClient.get('/compliance/controls', {
      params: { frameworkId },
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async getEvidence(tenantId: string, controlId: string) {
    return this.apiClient.get(`/compliance/controls/${controlId}/evidence`, {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  // ============================================================
  // INCIDENT MANAGEMENT ENDPOINTS
  // ============================================================

  async getIncidents(tenantId: string, filters?: Record<string, any>) {
    return this.apiClient.get('/incidents', {
      params: filters,
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async getIncident(tenantId: string, incidentId: string) {
    return this.apiClient.get(`/incidents/${incidentId}`, {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async createIncident(tenantId: string, data: any) {
    return this.apiClient.post('/incidents', data, {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async updateIncident(tenantId: string, incidentId: string, data: any) {
    return this.apiClient.put(`/incidents/${incidentId}`, data, {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  // ============================================================
  // VENDOR MANAGEMENT ENDPOINTS
  // ============================================================

  async getVendors(tenantId: string) {
    return this.apiClient.get('/vendors', {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async getVendor(tenantId: string, vendorId: string) {
    return this.apiClient.get(`/vendors/${vendorId}`, {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async createVendor(tenantId: string, data: any) {
    return this.apiClient.post('/vendors', data, {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  // ============================================================
  // AUDIT ENDPOINTS
  // ============================================================

  async getAudits(tenantId: string) {
    return this.apiClient.get('/audits', {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async getAudit(tenantId: string, auditId: string) {
    return this.apiClient.get(`/audits/${auditId}`, {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async createAudit(tenantId: string, data: any) {
    return this.apiClient.post('/audits', data, {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  // ============================================================
  // DASHBOARD & ANALYTICS ENDPOINTS
  // ============================================================

  async getRiskHeatmap(tenantId: string) {
    return this.apiClient.get('/analytics/heatmap', {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  async getComplianceStatus(tenantId: string) {
    return this.apiClient.get('/analytics/compliance-status', {
      headers: { 'X-Tenant-ID': tenantId },
    });
  }

  // ============================================================
  // GRAPHQL QUERY SUPPORT
  // ============================================================

  async graphqlQuery<T>(query: string, variables?: Record<string, any>): Promise<T> {
    return this.graphqlClient.request<T>(query, variables);
  }

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  setToken(token: string) {
    this.config.token = token;
    this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    this.graphqlClient.setHeader('Authorization', `Bearer ${token}`);
  }

  setApiKey(apiKey: string) {
    this.config.apiKey = apiKey;
    this.apiClient.defaults.headers.common['X-API-Key'] = apiKey;
    this.graphqlClient.setHeader('X-API-Key', apiKey);
  }

  clearAuth() {
    delete this.apiClient.defaults.headers.common['Authorization'];
    delete this.apiClient.defaults.headers.common['X-API-Key'];
  }
}
