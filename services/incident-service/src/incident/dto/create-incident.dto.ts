import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, Min, Max, IsDateString } from 'class-validator';

export enum IncidentSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

export enum IncidentStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  CONTAINMENT = 'containment',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REOPENED = 'reopened',
}

export enum IncidentType {
  SECURITY = 'security',
  DATA_BREACH = 'data_breach',
  SYSTEM_OUTAGE = 'system_outage',
  COMPLIANCE = 'compliance',
  OPERATIONAL = 'operational',
  POLICY_VIOLATION = 'policy_violation',
  FRAUD = 'fraud',
  OTHER = 'other',
}

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(IncidentType)
  @IsNotEmpty()
  type: IncidentType;

  @IsEnum(IncidentSeverity)
  @IsNotEmpty()
  severity: IncidentSeverity;

  @IsEnum(IncidentStatus)
  @IsOptional()
  status?: IncidentStatus = IncidentStatus.OPEN;

  @IsString()
  @IsOptional()
  reportedBy?: string; // User ID

  @IsString()
  @IsOptional()
  assignedTo?: string; // User ID

  @IsDateString()
  @IsNotEmpty()
  detectedAt: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  estimatedImpact?: number = 0;

  @IsString()
  @IsOptional()
  affectedSystems?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  estimatedAffectedRecords?: number = 0;
}
