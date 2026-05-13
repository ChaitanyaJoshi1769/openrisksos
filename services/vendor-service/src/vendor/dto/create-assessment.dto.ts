import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, Min, Max, IsDateString } from 'class-validator';

export enum AssessmentType {
  SECURITY_QUESTIONNAIRE = 'security_questionnaire',
  AUDIT_REPORT = 'audit_report',
  SOC2_REPORT = 'soc2_report',
  PENETRATION_TEST = 'penetration_test',
  VULNERABILITY_SCAN = 'vulnerability_scan',
  COMPLIANCE_ASSESSMENT = 'compliance_assessment',
  ONSITE_AUDIT = 'onsite_audit',
  SELF_ASSESSMENT = 'self_assessment',
}

export enum AssessmentStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PASSED = 'passed',
  FAILED = 'failed',
  REMEDIATION_REQUIRED = 'remediation_required',
}

export class CreateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @IsEnum(AssessmentType)
  @IsNotEmpty()
  type: AssessmentType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(AssessmentStatus)
  @IsOptional()
  status?: AssessmentStatus = AssessmentStatus.PLANNED;

  @IsDateString()
  @IsNotEmpty()
  assessmentDate: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  score?: number = 0;

  @IsString()
  @IsOptional()
  conductedBy?: string; // User ID or assessor name

  @IsString()
  @IsOptional()
  findings?: string;

  @IsString()
  @IsOptional()
  reportUrl?: string;
}
