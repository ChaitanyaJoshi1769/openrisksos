import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum EvidenceType {
  INTERVIEW = 'interview',
  OBSERVATION = 'observation',
  DOCUMENT = 'document',
  TEST_RESULT = 'test_result',
  WALKTHROUGH = 'walkthrough',
  SAMPLING = 'sampling',
  SYSTEM_OUTPUT = 'system_output',
  OTHER = 'other',
}

export class CreateEvidenceDto {
  @IsString()
  @IsNotEmpty()
  findingId: string;

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
  collectedBy?: string; // User ID

  @IsString()
  @IsOptional()
  reference?: string; // e.g., Interview ID, Document path
}
