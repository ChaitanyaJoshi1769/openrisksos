import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import {
  CreateFrameworkDto,
  UpdateFrameworkDto,
  CreateControlDto,
  CreateEvidenceDto,
  CreateControlTestDto,
  ComplianceFilterDto,
  ControlStatus,
} from './dto';

@Controller('api/v1/compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  private getTenantId(headers: Record<string, string>): string {
    const tenantId = headers['x-tenant-id'];
    if (!tenantId) {
      throw new BadRequestException('Missing X-Tenant-ID header');
    }
    return tenantId;
  }

  // Framework Endpoints
  @Post('frameworks')
  async createFramework(
    @Headers() headers: Record<string, string>,
    @Body() input: CreateFrameworkDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.createFramework(tenantId, input);
  }

  @Get('frameworks')
  async getFrameworks(
    @Headers() headers: Record<string, string>,
    @Query() filter: ComplianceFilterDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.getFrameworks(tenantId, filter);
  }

  @Get('frameworks/:id')
  async getFrameworkById(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.getFrameworkById(tenantId, id);
  }

  @Put('frameworks/:id')
  async updateFramework(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() input: UpdateFrameworkDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.updateFramework(tenantId, id, input);
  }

  @Delete('frameworks/:id')
  @HttpCode(204)
  async deleteFramework(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    await this.complianceService.deleteFramework(tenantId, id);
  }

  // Control Endpoints
  @Post('controls')
  async createControl(
    @Headers() headers: Record<string, string>,
    @Body() input: CreateControlDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.createControl(tenantId, input);
  }

  @Get('controls')
  async getControls(
    @Headers() headers: Record<string, string>,
    @Query() filter: ComplianceFilterDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.getControls(tenantId, filter);
  }

  @Get('controls/:id')
  async getControlById(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.getControlById(tenantId, id);
  }

  @Put('controls/:id')
  async updateControl(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() input: Partial<CreateControlDto>,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.updateControl(tenantId, id, input);
  }

  @Put('controls/:id/status')
  async updateControlStatus(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body('status') status: ControlStatus,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.updateControlStatus(tenantId, id, status);
  }

  @Delete('controls/:id')
  @HttpCode(204)
  async deleteControl(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    await this.complianceService.deleteControl(tenantId, id);
  }

  // Evidence Endpoints
  @Post('evidence')
  async createEvidence(
    @Headers() headers: Record<string, string>,
    @Body() input: CreateEvidenceDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.createEvidence(tenantId, input);
  }

  @Get('controls/:controlId/evidence')
  async getEvidenceByControl(
    @Headers() headers: Record<string, string>,
    @Param('controlId') controlId: string,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.getEvidenceByControl(tenantId, controlId);
  }

  @Delete('evidence/:id')
  @HttpCode(204)
  async deleteEvidence(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    await this.complianceService.deleteEvidence(tenantId, id);
  }

  // Control Test Endpoints
  @Post('tests')
  async createControlTest(
    @Headers() headers: Record<string, string>,
    @Body() input: CreateControlTestDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.createControlTest(tenantId, input);
  }

  @Get('controls/:controlId/tests')
  async getControlTests(
    @Headers() headers: Record<string, string>,
    @Param('controlId') controlId: string,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.getControlTests(tenantId, controlId);
  }

  // Compliance Status
  @Get('status')
  async getComplianceStatus(@Headers() headers: Record<string, string>) {
    const tenantId = this.getTenantId(headers);
    return this.complianceService.getComplianceStatus(tenantId);
  }
}
