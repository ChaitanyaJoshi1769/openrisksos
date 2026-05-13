import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum FindingSeverity {
  CRITICAL = 'critical',
  MAJOR = 'major',
  MINOR = 'minor',
  OBSERVATION = 'observation',
}

export enum FindingStatus {
  OPEN = 'open',
  IN_REMEDIATION = 'in_remediation',
  REMEDIATED = 'remediated',
  CLOSED = 'closed',
  DEFERRED = 'deferred',
}

export class CreateFindingDto {
  @IsString()
  @IsNotEmpty()
  auditId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(FindingSeverity)
  @IsNotEmpty()
  severity: FindingSeverity;

  @IsString()
  @IsNotEmpty()
  category: string; // e.g., "Security", "Compliance", "Operational"

  @IsString()
  @IsOptional()
  rootCause?: string;

  @IsString()
  @IsOptional()
  recommendation?: string;

  @IsEnum(FindingStatus)
  @IsOptional()
  status?: FindingStatus = FindingStatus.OPEN;

  @IsString()
  @IsOptional()
  assignedTo?: string; // User ID
}
