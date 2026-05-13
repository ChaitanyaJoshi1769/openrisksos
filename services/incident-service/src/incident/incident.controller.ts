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
import { IncidentService } from './incident.service';
import {
  CreateIncidentDto,
  UpdateIncidentDto,
  CreateTimelineDto,
  CreateCorrectiveActionDto,
  IncidentFilterDto,
  IncidentStatus,
} from './dto';

@Controller('api/v1/incidents')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  private getTenantId(headers: Record<string, string>): string {
    const tenantId = headers['x-tenant-id'];
    if (!tenantId) {
      throw new BadRequestException('Missing X-Tenant-ID header');
    }
    return tenantId;
  }

  // Incident Endpoints
  @Post()
  async createIncident(
    @Headers() headers: Record<string, string>,
    @Body() input: CreateIncidentDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.incidentService.createIncident(tenantId, input);
  }

  @Get()
  async getIncidents(
    @Headers() headers: Record<string, string>,
    @Query() filter: IncidentFilterDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.incidentService.getIncidents(tenantId, filter);
  }

  @Get(':id')
  async getIncidentById(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    return this.incidentService.getIncidentById(tenantId, id);
  }

  @Put(':id')
  async updateIncident(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() input: UpdateIncidentDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.incidentService.updateIncident(tenantId, id, input);
  }

  @Put(':id/status')
  async updateIncidentStatus(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body('status') status: IncidentStatus,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.incidentService.updateIncidentStatus(tenantId, id, status);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteIncident(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    await this.incidentService.deleteIncident(tenantId, id);
  }

  // Timeline Endpoints
  @Post(':incidentId/timeline')
  async createTimeline(
    @Headers() headers: Record<string, string>,
    @Body() input: CreateTimelineDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.incidentService.createTimeline(tenantId, input);
  }

  @Get(':incidentId/timeline')
  async getIncidentTimeline(
    @Headers() headers: Record<string, string>,
    @Param('incidentId') incidentId: string,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.incidentService.getIncidentTimeline(tenantId, incidentId);
  }

  @Delete('timeline/:id')
  @HttpCode(204)
  async deleteTimeline(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    const tenantId = this.getTenantId(headers);
    await this.incidentService.deleteTimeline(tenantId, id);
  }

  // Corrective Action Endpoints
  @Post(':incidentId/actions')
  async createCorrectiveAction(
    @Headers() headers: Record<string, string>,
    @Body() input: CreateCorrectiveActionDto,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.incidentService.createCorrectiveAction(tenantId, input);
  }

  @Get(':incidentId/actions')
  async getIncidentCorrectiveActions(
    @Headers() headers: Record<string, string>,
    @Param('incidentId') incidentId: string,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.incidentService.getIncidentCorrectiveActions(tenantId, incidentId);
  }

  @Put('actions/:id')
  async updateCorrectiveAction(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() input: Partial<CreateCorrectiveActionDto>,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.incidentService.updateCorrectiveAction(tenantId, id, input);
  }

  @Put('actions/:id/complete')
  async completeCorrectiveAction(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
  ) {
    const tenantId = this.getTenantId(headers);
    return this.incidentService.completeCorrectiveAction(tenantId, id);
  }

  @Delete('actions/:id')
  @HttpCode(204)
  async deleteCorrectiveAction(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
  ) {
    const tenantId = this.getTenantId(headers);
    await this.incidentService.deleteCorrectiveAction(tenantId, id);
  }

  // Analytics Endpoints
  @Get('analytics/stats')
  async getIncidentStats(@Headers() headers: Record<string, string>) {
    const tenantId = this.getTenantId(headers);
    return this.incidentService.getIncidentStats(tenantId);
  }

  @Get('analytics/overdue')
  async getOverdueActions(@Headers() headers: Record<string, string>) {
    const tenantId = this.getTenantId(headers);
    return this.incidentService.getOverdueActions(tenantId);
  }
}
