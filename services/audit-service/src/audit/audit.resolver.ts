import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
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

@Resolver()
export class AuditResolver {
  constructor(private readonly auditService: AuditService) {}

  // Audit Queries
  @Query()
  async audits(
    @Args('tenantId') tenantId: string,
    @Args('filter', { nullable: true }) filter?: AuditFilterDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.getAudits(tenantId, filter || new AuditFilterDto());
  }

  @Query()
  async audit(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.getAuditById(tenantId, id);
  }

  // Audit Mutations
  @Mutation()
  async createAudit(@Args('tenantId') tenantId: string, @Args('input') input: CreateAuditDto) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.createAudit(tenantId, input);
  }

  @Mutation()
  async updateAudit(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
    @Args('input') input: UpdateAuditDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.updateAudit(tenantId, id, input);
  }

  @Mutation()
  async updateAuditStatus(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
    @Args('status') status: AuditStatus,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.updateAuditStatus(tenantId, id, status);
  }

  @Mutation()
  async deleteAudit(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    await this.auditService.deleteAudit(tenantId, id);
    return true;
  }

  // Finding Queries & Mutations
  @Query()
  async auditFindings(
    @Args('tenantId') tenantId: string,
    @Args('auditId') auditId: string,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.getAuditFindings(tenantId, auditId);
  }

  @Query()
  async finding(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.getFindingById(tenantId, id);
  }

  @Mutation()
  async createFinding(
    @Args('tenantId') tenantId: string,
    @Args('input') input: CreateFindingDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.createFinding(tenantId, input);
  }

  @Mutation()
  async updateFinding(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
    @Args('input') input: Partial<CreateFindingDto>,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.updateFinding(tenantId, id, input);
  }

  @Mutation()
  async updateFindingStatus(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
    @Args('status') status: FindingStatus,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.updateFindingStatus(tenantId, id, status);
  }

  @Mutation()
  async deleteFinding(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    await this.auditService.deleteFinding(tenantId, id);
    return true;
  }

  // Evidence Queries & Mutations
  @Query()
  async evidence(
    @Args('tenantId') tenantId: string,
    @Args('findingId') findingId: string,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.getEvidenceByFinding(tenantId, findingId);
  }

  @Mutation()
  async createEvidence(
    @Args('tenantId') tenantId: string,
    @Args('input') input: CreateEvidenceDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.createEvidence(tenantId, input);
  }

  @Mutation()
  async deleteEvidence(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    await this.auditService.deleteEvidence(tenantId, id);
    return true;
  }

  // Analytics Queries
  @Query()
  async auditStats(@Args('tenantId') tenantId: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.getAuditStats(tenantId);
  }

  @Query()
  async findingStats(
    @Args('tenantId') tenantId: string,
    @Args('auditId', { nullable: true }) auditId?: string,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.getFindingStats(tenantId, auditId);
  }

  @Query()
  async openFindings(@Args('tenantId') tenantId: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.auditService.getOpenFindings(tenantId);
  }
}
