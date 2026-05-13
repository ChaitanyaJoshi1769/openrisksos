import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { VendorType, VendorStatus } from './create-vendor.dto';

export class VendorFilterDto {
  @IsOptional()
  @IsEnum(VendorType)
  classification?: VendorType;

  @IsOptional()
  @IsEnum(VendorStatus)
  status?: VendorStatus;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  managedBy?: string;

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
  sortBy?: string = 'name';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @IsString()
  search?: string; // Full-text search
}
