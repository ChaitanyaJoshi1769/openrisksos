import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';

export enum ControlStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  NOT_APPLICABLE = 'not_applicable',
}

export enum ControlFrequency {
  ANNUAL = 'annual',
  QUARTERLY = 'quarterly',
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  DAILY = 'daily',
  CONTINUOUS = 'continuous',
}

export class CreateControlDto {
  @IsString()
  @IsNotEmpty()
  frameworkId: string;

  @IsString()
  @IsNotEmpty()
  controlId: string; // e.g., A.5.1.1 for ISO27001

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ControlStatus)
  @IsOptional()
  status?: ControlStatus = ControlStatus.NOT_STARTED;

  @IsEnum(ControlFrequency)
  @IsNotEmpty()
  frequency: ControlFrequency;

  @IsString()
  @IsOptional()
  owner?: string; // User ID

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  maturityLevel?: number = 0;
}
