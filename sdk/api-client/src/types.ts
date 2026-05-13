// Risk Types
export interface Risk {
  id: string;
  title: string;
  description?: string;
  riskCategory: string;
  probability: number;
  inherentImpact: number;
  inherentScore: number;
  residualImpact?: number;
  residualScore?: number;
  status: string;
  ownerId: string;
  businessUnit?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Incident Types
export interface Incident {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  severity: string;
  reportedDate: Date;
  affectedSystems: string[];
  affectedUsers: number;
  dataExposed: boolean;
  rootCause?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Compliance Types
export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  description?: string;
  status: string;
}

export interface ComplianceControl {
  id: string;
  controlId: string;
  name: string;
  description?: string;
  status: string;
  owner?: string;
}

export interface Evidence {
  id: string;
  controlId: string;
  documentUrl: string;
  documentName: string;
  documentType: string;
  status: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// Vendor Types
export interface Vendor {
  id: string;
  name: string;
  type: string;
  description?: string;
  riskScore: number;
  status: string;
  manager?: string;
  contractedServices: string[];
  assessmentDate?: Date;
}

// Audit Types
export interface Audit {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  planner: string;
  plannedStart?: Date;
  plannedEnd?: Date;
}

// Dashboard Types
export interface RiskHeatmapData {
  matrix: number[][];
  totalRisks: number;
  criticalRisks: number;
}

export interface ComplianceStatus {
  frameworkId: string;
  frameworkName: string;
  compliantControls: number;
  nonCompliantControls: number;
  compliancePercentage: number;
}
