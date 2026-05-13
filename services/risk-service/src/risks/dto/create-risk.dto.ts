import { IsString, IsInt, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class CreateRiskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  riskCategory: string; // strategic, operational, compliance, financial, cyber, reputational

  @IsInt()
  @Min(1)
  @Max(5)
  probability: number; // 1-5

  @IsInt()
  @Min(1)
  @Max(5)
  inherentImpact: number; // 1-5

  @IsString()
  ownerId: string;

  @IsOptional()
  @IsString()
  businessUnit?: string;

  @IsOptional()
  @IsDateString()
  targetMitigationDate?: string;
}
