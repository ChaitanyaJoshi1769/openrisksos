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
import { AuditService } from './audit.service';
import {
  CreateAuditDto,
  UpdateAuditDto,
  CreateFindingDto,
  CreateEvidenceDto,
  AuditFilterDto,
  AuditStatus,
  FindingStatus,
} from './dto';

@Controller('api/v1/audits')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  private getTenantId(headers: Record<string, string>): string {
    const tenantId = headers['x-tenant-id'];
    if (!tenantId) {
      throw new BadRequestException('Missing X-Tenant-ID header');
    }
    return tenantId;
  }

  // Audit Endpoints
  @Post()
  async createAudit(@Headers() headers: Record<string, string>, @Body() input: CreateAuditDto) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.createAudit(tenantId, input);
  }

  @Get()
  async getAudits(
    @Headers() headers: Record<string, string>,
    @Query() filter: AuditFilterDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.getAudits(tenantId, filter);
  }

  @Get(':id')
  async getAuditById(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.getAuditById(tenantId, id);
  }

  @Put(':id')
  async updateAudit(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() input: UpdateAuditDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.updateAudit(tenantId, id, input);
  }

  @Put(':id/status')
  async updateAuditStatus(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body('status') status: AuditStatus,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.updateAuditStatus(tenantId, id, status);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteAudit(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    await this.auditService.deleteAudit(tenantId, id);
  }

  // Finding Endpoints
  @Post(':auditId/findings')
  async createFinding(
    @Headers() headers: Record<string, string>,
    @Body() input: CreateFindingDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.createFinding(tenantId, input);
  }

  @Get(':auditId/findings')
  async getAuditFindings(
    @Headers() headers: Record<string, string>,
    @Param('auditId') auditId: string,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.getAuditFindings(tenantId, auditId);
  }

  @Get('findings/:id')
  async getFindingById(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.getFindingById(tenantId, id);
  }

  @Put('findings/:id')
  async updateFinding(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() input: Partial<CreateFindingDto>,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.updateFinding(tenantId, id, input);
  }

  @Put('findings/:id/status')
  async updateFindingStatus(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body('status') status: FindingStatus,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.updateFindingStatus(tenantId, id, status);
  }

  @Delete('findings/:id')
  @HttpCode(204)
  async deleteFinding(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    await this.auditService.deleteFinding(tenantId, id);
  }

  // Evidence Endpoints
  @Post('evidence')
  async createEvidence(
    @Headers() headers: Record<string, string>,
    @Body() input: CreateEvidenceDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.createEvidence(tenantId, input);
  }

  @Get('findings/:findingId/evidence')
  async getEvidenceByFinding(
    @Headers() headers: Record<string, string>,
    @Param('findingId') findingId: string,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.getEvidenceByFinding(tenantId, findingId);
  }

  @Delete('evidence/:id')
  @HttpCode(204)
  async deleteEvidence(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    await this.auditService.deleteEvidence(tenantId, id);
  }

  // Analytics Endpoints
  @Get('analytics/audits')
  async getAuditStats(@Headers() headers: Record<string, string>) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.getAuditStats(tenantId);
  }

  @Get('analytics/findings')
  async getFindingStats(
    @Headers() headers: Record<string, string>,
    @Query('auditId') auditId?: string,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.getFindingStats(tenantId, auditId);
  }

  @Get('analytics/open-findings')
  async getOpenFindings(@Headers() headers: Record<string, string>) {
    const tenantId = this.getTenantId(headers);
    return this.auditService.getOpenFindings(tenantId);
  }
}
