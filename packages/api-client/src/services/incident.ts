import { BaseApiClient } from '../base';

export interface Incident {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  type: string;
  severity: string;
  status: string;
  detectedAt: string;
  affectedRecords: number;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncidentDto {
  title: string;
  description?: string;
  type: string;
  severity: string;
  affectedRecords?: number;
}

export interface UpdateIncidentDto {
  title?: string;
  description?: string;
  severity?: string;
  status?: string;
  assignedTo?: string;
}

export interface IncidentTimeline {
  id: string;
  incidentId: string;
  eventType: string;
  description: string;
  timestamp: string;
  createdBy: string;
}

export interface CreateTimelineDto {
  eventType: string;
  description: string;
}

export interface CorrectiveAction {
  id: string;
  incidentId: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  dueDate: string;
  assignedTo: string;
}

export interface CreateCorrectiveActionDto {
  title: string;
  description?: string;
  type: string;
  dueDate: string;
  assignedTo: string;
}

export class IncidentService extends BaseApiClient {
  constructor(baseURL: string, tenantId: string, token?: string) {
    super({
      baseURL,
      tenantId,
      token,
    });
  }

  /**
   * Create a new incident
   */
  async createIncident(data: CreateIncidentDto): Promise<Incident> {
    return this.post<Incident>('/api/v1/incidents', data);
  }

  /**
   * Get all incidents
   */
  async getIncidents(filters?: {
    status?: string;
    severity?: string;
    skip?: number;
    take?: number;
  }): Promise<Incident[]> {
    return this.get<Incident[]>('/api/v1/incidents', filters);
  }

  /**
   * Get a specific incident
   */
  async getIncident(id: string): Promise<Incident> {
    return this.get<Incident>(`/api/v1/incidents/${id}`);
  }

  /**
   * Update an incident
   */
  async updateIncident(id: string, data: UpdateIncidentDto): Promise<Incident> {
    return this.put<Incident>(`/api/v1/incidents/${id}`, data);
  }

  /**
   * Update incident status
   */
  async updateIncidentStatus(id: string, status: string): Promise<Incident> {
    return this.put<Incident>(`/api/v1/incidents/${id}/status`, { status });
  }

  /**
   * Add timeline event
   */
  async addTimelineEvent(incidentId: string, data: CreateTimelineDto): Promise<IncidentTimeline> {
    return this.post<IncidentTimeline>(`/api/v1/incidents/${incidentId}/timeline`, data);
  }

  /**
   * Get timeline for incident
   */
  async getTimeline(incidentId: string): Promise<IncidentTimeline[]> {
    return this.get<IncidentTimeline[]>(`/api/v1/incidents/${incidentId}/timeline`);
  }

  /**
   * Create corrective action
   */
  async createCorrectiveAction(
    incidentId: string,
    data: CreateCorrectiveActionDto
  ): Promise<CorrectiveAction> {
    return this.post<CorrectiveAction>(`/api/v1/incidents/${incidentId}/actions`, data);
  }

  /**
   * Get corrective actions for incident
   */
  async getCorrectiveActions(incidentId: string): Promise<CorrectiveAction[]> {
    return this.get<CorrectiveAction[]>(`/api/v1/incidents/${incidentId}/actions`);
  }

  /**
   * Update corrective action status
   */
  async updateActionStatus(
    incidentId: string,
    actionId: string,
    status: string
  ): Promise<CorrectiveAction> {
    return this.put<CorrectiveAction>(
      `/api/v1/incidents/${incidentId}/actions/${actionId}/status`,
      { status }
    );
  }

  /**
   * Get incident statistics
   */
  async getIncidentStats(): Promise<{
    total: number;
    bySeverity: Record<string, number>;
    byStatus: Record<string, number>;
    avgResolutionTime: number;
    openCount: number;
  }> {
    return this.get('/api/v1/incidents/statistics');
  }

  /**
   * Get open incidents
   */
  async getOpenIncidents(): Promise<Incident[]> {
    return this.getIncidents({ status: 'OPEN' });
  }

  /**
   * Get critical incidents
   */
  async getCriticalIncidents(): Promise<Incident[]> {
    return this.getIncidents({ severity: 'CRITICAL' });
  }

  /**
   * Assign incident to user
   */
  async assignIncident(id: string, userId: string): Promise<Incident> {
    return this.put<Incident>(`/api/v1/incidents/${id}/assign`, { userId });
  }
}
