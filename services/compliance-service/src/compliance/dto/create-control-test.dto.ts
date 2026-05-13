import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export enum TestResult {
  PASSED = 'passed',
  FAILED = 'failed',
  INCONCLUSIVE = 'inconclusive',
  NOT_TESTED = 'not_tested',
}

export class CreateControlTestDto {
  @IsString()
  @IsNotEmpty()
  controlId: string;

  @IsString()
  @IsNotEmpty()
  testName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TestResult)
  @IsNotEmpty()
  result: TestResult;

  @IsString()
  @IsOptional()
  findings?: string;

  @IsBoolean()
  @IsOptional()
  remediated?: boolean = false;

  @IsString()
  @IsOptional()
  testedBy?: string;
}
