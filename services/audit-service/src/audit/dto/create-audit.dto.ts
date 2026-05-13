import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsInt, Min } from 'class-validator';

export enum AuditType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  COMPLIANCE = 'compliance',
  IT = 'it',
  OPERATIONAL = 'operational',
  FINANCIAL = 'financial',
  SPECIAL = 'special',
}

export enum AuditStatus {
  PLANNED = 'planned',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  DRAFT_REPORT = 'draft_report',
  REPORT_ISSUED = 'report_issued',
  CLOSED = 'closed',
}

export enum AuditPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export class CreateAuditDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(AuditType)
  @IsNotEmpty()
  type: AuditType;

  @IsEnum(AuditStatus)
  @IsOptional()
  status?: AuditStatus = AuditStatus.PLANNED;

  @IsEnum(AuditPriority)
  @IsOptional()
  priority?: AuditPriority = AuditPriority.MEDIUM;

  @IsDateString()
  @IsNotEmpty()
  scheduledDate: string;

  @IsString()
  @IsOptional()
  auditScope?: string;

  @IsString()
  @IsOptional()
  leadAuditor?: string; // User ID

  @IsString()
  @IsOptional()
  auditedArea?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  estimatedDays?: number = 5;
}
