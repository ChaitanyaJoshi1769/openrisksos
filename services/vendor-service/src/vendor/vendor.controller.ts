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
import { VendorService } from './vendor.service';
import {
  CreateVendorDto,
  UpdateVendorDto,
  CreateAssessmentDto,
  CreateBreachDto,
  VendorFilterDto,
  VendorStatus,
} from './dto';

@Controller('api/v1/vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  private getTenantId(headers: Record<string, string>): string {
    const tenantId = headers['x-tenant-id'];
    if (!tenantId) {
      throw new BadRequestException('Missing X-Tenant-ID header');
    }
    return tenantId;
  }

  // Vendor Endpoints
  @Post()
  async createVendor(@Headers() headers: Record<string, string>, @Body() input: CreateVendorDto) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.createVendor(tenantId, input);
  }

  @Get()
  async getVendors(
    @Headers() headers: Record<string, string>,
    @Query() filter: VendorFilterDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.getVendors(tenantId, filter);
  }

  @Get(':id')
  async getVendorById(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.getVendorById(tenantId, id);
  }

  @Put(':id')
  async updateVendor(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() input: UpdateVendorDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.updateVendor(tenantId, id, input);
  }

  @Put(':id/status')
  async updateVendorStatus(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body('status') status: VendorStatus,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.updateVendorStatus(tenantId, id, status);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteVendor(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    await this.vendorService.deleteVendor(tenantId, id);
  }

  // Assessment Endpoints
  @Post(':vendorId/assessments')
  async createAssessment(
    @Headers() headers: Record<string, string>,
    @Body() input: CreateAssessmentDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.createAssessment(tenantId, input);
  }

  @Get(':vendorId/assessments')
  async getVendorAssessments(
    @Headers() headers: Record<string, string>,
    @Param('vendorId') vendorId: string,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.getVendorAssessments(tenantId, vendorId);
  }

  @Put('assessments/:id')
  async updateAssessment(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() input: Partial<CreateAssessmentDto>,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.updateAssessment(tenantId, id, input);
  }

  @Delete('assessments/:id')
  @HttpCode(204)
  async deleteAssessment(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    await this.vendorService.deleteAssessment(tenantId, id);
  }

  // Breach Endpoints
  @Post(':vendorId/breaches')
  async createBreach(
    @Headers() headers: Record<string, string>,
    @Body() input: CreateBreachDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.createBreach(tenantId, input);
  }

  @Get(':vendorId/breaches')
  async getVendorBreaches(
    @Headers() headers: Record<string, string>,
    @Param('vendorId') vendorId: string,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.getVendorBreaches(tenantId, vendorId);
  }

  @Put('breaches/:id')
  async updateBreach(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() input: Partial<CreateBreachDto>,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.updateBreach(tenantId, id, input);
  }

  @Delete('breaches/:id')
  @HttpCode(204)
  async deleteBreach(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    await this.vendorService.deleteBreach(tenantId, id);
  }

  // Analytics Endpoints
  @Get(':vendorId/risk-profile')
  async getVendorRiskProfile(
    @Headers() headers: Record<string, string>,
    @Param('vendorId') vendorId: string,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.getVendorRiskProfile(tenantId, vendorId);
  }

  @Get('analytics/stats')
  async getVendorRiskStats(@Headers() headers: Record<string, string>) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.getVendorRiskStats(tenantId);
  }

  @Get('analytics/overdue-assessments')
  async getVendorsRequiringAssessment(
    @Headers() headers: Record<string, string>,
    @Query('daysOverdue') daysOverdue: number = 90,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.vendorService.getVendorsRequiringAssessment(tenantId, daysOverdue);
  }
}
