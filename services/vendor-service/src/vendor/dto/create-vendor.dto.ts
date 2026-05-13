import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail, IsUrl, IsInt, Min, Max } from 'class-validator';

export enum VendorType {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum VendorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_REVIEW = 'under_review',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated',
}

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(VendorType)
  @IsNotEmpty()
  classification: VendorType;

  @IsEnum(VendorStatus)
  @IsOptional()
  status?: VendorStatus = VendorStatus.ACTIVE;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactName?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  riskScore?: number = 0;

  @IsString()
  @IsOptional()
  managedBy?: string; // User ID

  @IsString()
  @IsOptional()
  dataProcessingAgreement?: string; // URL or reference
}
