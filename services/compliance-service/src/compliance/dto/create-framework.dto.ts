import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum FrameworkType {
  ISO27001 = 'iso27001',
  NIST = 'nist',
  SOC2 = 'soc2',
  HIPAA = 'hipaa',
  GDPR = 'gdpr',
  PCI_DSS = 'pci_dss',
  COBIT = 'cobit',
  CUSTOM = 'custom',
}

export class CreateFrameworkDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(FrameworkType)
  @IsNotEmpty()
  type: FrameworkType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  version?: string;
}
