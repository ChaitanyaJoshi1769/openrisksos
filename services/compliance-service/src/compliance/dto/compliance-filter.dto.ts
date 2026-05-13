import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { ControlStatus, FrameworkType } from './create-control.dto';

export class ComplianceFilterDto {
  @IsOptional()
  @IsString()
  frameworkId?: string;

  @IsOptional()
  @IsEnum(FrameworkType)
  frameworkType?: FrameworkType;

  @IsOptional()
  @IsEnum(ControlStatus)
  status?: ControlStatus;

  @IsOptional()
  @IsString()
  owner?: string;

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
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
