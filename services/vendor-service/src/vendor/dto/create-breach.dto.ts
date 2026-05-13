import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsInt, Min } from 'class-validator';

export enum BreachSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum BreachStatus {
  REPORTED = 'reported',
  INVESTIGATING = 'investigating',
  CONTAINED = 'contained',
  RESOLVED = 'resolved',
}

export class CreateBreachDto {
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(BreachSeverity)
  @IsNotEmpty()
  severity: BreachSeverity;

  @IsEnum(BreachStatus)
  @IsOptional()
  status?: BreachStatus = BreachStatus.REPORTED;

  @IsDateString()
  @IsNotEmpty()
  detectedDate: string;

  @IsDateString()
  @IsOptional()
  disclosedDate?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  affectedRecords?: number = 0;

  @IsString()
  @IsOptional()
  dataTypes?: string; // e.g., "PII, Financial, Health"

  @IsString()
  @IsOptional()
  impactAssessment?: string;

  @IsString()
  @IsOptional()
  rootCause?: string;

  @IsString()
  @IsOptional()
  remediationSteps?: string;
}
