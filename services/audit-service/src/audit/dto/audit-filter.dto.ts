import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { AuditStatus, AuditType, AuditPriority } from './create-audit.dto';

export class AuditFilterDto {
  @IsOptional()
  @IsEnum(AuditStatus)
  status?: AuditStatus;

  @IsOptional()
  @IsEnum(AuditType)
  type?: AuditType;

  @IsOptional()
  @IsEnum(AuditPriority)
  priority?: AuditPriority;

  @IsOptional()
  @IsString()
  leadAuditor?: string;

  @IsOptional()
  @IsString()
  auditedArea?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  sortBy?: string = 'scheduledDate';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
