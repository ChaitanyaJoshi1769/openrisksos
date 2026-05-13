import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
import { IncidentService } from './incident.service';
import {
  CreateIncidentDto,
  UpdateIncidentDto,
  CreateTimelineDto,
  CreateCorrectiveActionDto,
  IncidentFilterDto,
  IncidentStatus,
} from './dto';

@Resolver()
export class IncidentResolver {
  constructor(private readonly incidentService: IncidentService) {}

  // Incident Queries
  @Query()
  async incidents(
    @Args('tenantId') tenantId: string,
    @Args('filter', { nullable: true }) filter?: IncidentFilterDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.incidentService.getIncidents(tenantId, filter || new IncidentFilterDto());
  }

  @Query()
  async incident(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.incidentService.getIncidentById(tenantId, id);
  }

  // Incident Mutations
  @Mutation()
  async createIncident(
    @Args('tenantId') tenantId: string,
    @Args('input') input: CreateIncidentDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.incidentService.createIncident(tenantId, input);
  }

  @Mutation()
  async updateIncident(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
    @Args('input') input: UpdateIncidentDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.incidentService.updateIncident(tenantId, id, input);
  }

  @Mutation()
  async updateIncidentStatus(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
    @Args('status') status: IncidentStatus,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.incidentService.updateIncidentStatus(tenantId, id, status);
  }

  @Mutation()
  async deleteIncident(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    await this.incidentService.deleteIncident(tenantId, id);
    return true;
  }

  // Timeline Queries & Mutations
  @Query()
  async incidentTimeline(
    @Args('tenantId') tenantId: string,
    @Args('incidentId') incidentId: string,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.incidentService.getIncidentTimeline(tenantId, incidentId);
  }

  @Mutation()
  async createTimeline(
    @Args('tenantId') tenantId: string,
    @Args('input') input: CreateTimelineDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.incidentService.createTimeline(tenantId, input);
  }

  @Mutation()
  async deleteTimeline(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    await this.incidentService.deleteTimeline(tenantId, id);
    return true;
  }

  // Corrective Action Queries & Mutations
  @Query()
  async incidentCorrectiveActions(
    @Args('tenantId') tenantId: string,
    @Args('incidentId') incidentId: string,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.incidentService.getIncidentCorrectiveActions(tenantId, incidentId);
  }

  @Mutation()
  async createCorrectiveAction(
    @Args('tenantId') tenantId: string,
    @Args('input') input: CreateCorrectiveActionDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.incidentService.createCorrectiveAction(tenantId, input);
  }

  @Mutation()
  async updateCorrectiveAction(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
    @Args('input') input: Partial<CreateCorrectiveActionDto>,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.incidentService.updateCorrectiveAction(tenantId, id, input);
  }

  @Mutation()
  async completeCorrectiveAction(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.incidentService.completeCorrectiveAction(tenantId, id);
  }

  @Mutation()
  async deleteCorrectiveAction(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    await this.incidentService.deleteCorrectiveAction(tenantId, id);
    return true;
  }

  // Analytics Queries
  @Query()
  async incidentStats(@Args('tenantId') tenantId: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.incidentService.getIncidentStats(tenantId);
  }

  @Query()
  async overdueActions(@Args('tenantId') tenantId: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.incidentService.getOverdueActions(tenantId);
  }
}
