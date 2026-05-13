import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum EvidenceType {
  POLICY = 'policy',
  PROCEDURE = 'procedure',
  AUDIT_REPORT = 'audit_report',
  TEST_RESULT = 'test_result',
  SCREENSHOT = 'screenshot',
  LOG_FILE = 'log_file',
  CERTIFICATE = 'certificate',
  ASSESSMENT = 'assessment',
  OTHER = 'other',
}

export class CreateEvidenceDto {
  @IsString()
  @IsNotEmpty()
  controlId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(EvidenceType)
  @IsNotEmpty()
  type: EvidenceType;

  @IsString()
  @IsOptional()
  documentUrl?: string;

  @IsString()
  @IsOptional()
  uploadedBy?: string;
}
