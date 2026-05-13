import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
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

@Resolver()
export class ComplianceResolver {
  constructor(private readonly complianceService: ComplianceService) {}

  // Framework Queries
  @Query()
  async frameworks(
    @Args('tenantId') tenantId: string,
    @Args('filter', { nullable: true }) filter?: ComplianceFilterDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.getFrameworks(
      tenantId,
      filter || new ComplianceFilterDto(),
    );
  }

  @Query()
  async framework(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.getFrameworkById(tenantId, id);
  }

  // Framework Mutations
  @Mutation()
  async createFramework(
    @Args('tenantId') tenantId: string,
    @Args('input') input: CreateFrameworkDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.createFramework(tenantId, input);
  }

  @Mutation()
  async updateFramework(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
    @Args('input') input: UpdateFrameworkDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.updateFramework(tenantId, id, input);
  }

  @Mutation()
  async deleteFramework(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    await this.complianceService.deleteFramework(tenantId, id);
    return true;
  }

  // Control Queries
  @Query()
  async controls(
    @Args('tenantId') tenantId: string,
    @Args('filter', { nullable: true }) filter?: ComplianceFilterDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.getControls(tenantId, filter || new ComplianceFilterDto());
  }

  @Query()
  async control(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.getControlById(tenantId, id);
  }

  // Control Mutations
  @Mutation()
  async createControl(
    @Args('tenantId') tenantId: string,
    @Args('input') input: CreateControlDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.createControl(tenantId, input);
  }

  @Mutation()
  async updateControl(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
    @Args('input') input: Partial<CreateControlDto>,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.updateControl(tenantId, id, input);
  }

  @Mutation()
  async updateControlStatus(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
    @Args('status') status: ControlStatus,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.updateControlStatus(tenantId, id, status);
  }

  @Mutation()
  async deleteControl(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    await this.complianceService.deleteControl(tenantId, id);
    return true;
  }

  // Evidence Queries & Mutations
  @Query()
  async evidence(
    @Args('tenantId') tenantId: string,
    @Args('controlId') controlId: string,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.getEvidenceByControl(tenantId, controlId);
  }

  @Mutation()
  async createEvidence(
    @Args('tenantId') tenantId: string,
    @Args('input') input: CreateEvidenceDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.createEvidence(tenantId, input);
  }

  @Mutation()
  async deleteEvidence(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    await this.complianceService.deleteEvidence(tenantId, id);
    return true;
  }

  // Control Test Queries & Mutations
  @Query()
  async controlTests(
    @Args('tenantId') tenantId: string,
    @Args('controlId') controlId: string,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.getControlTests(tenantId, controlId);
  }

  @Mutation()
  async createControlTest(
    @Args('tenantId') tenantId: string,
    @Args('input') input: CreateControlTestDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.createControlTest(tenantId, input);
  }

  // Compliance Status
  @Query()
  async complianceStatus(@Args('tenantId') tenantId: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.complianceService.getComplianceStatus(tenantId);
  }
}
