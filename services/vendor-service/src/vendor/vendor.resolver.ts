import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
import { VendorService } from './vendor.service';
import {
  CreateVendorDto,
  UpdateVendorDto,
  CreateAssessmentDto,
  CreateBreachDto,
  VendorFilterDto,
  VendorStatus,
} from './dto';

@Resolver()
export class VendorResolver {
  constructor(private readonly vendorService: VendorService) {}

  @Query()
  async vendors(
    @Args('tenantId') tenantId: string,
    @Args('filter', { nullable: true }) filter?: VendorFilterDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.vendorService.getVendors(tenantId, filter || new VendorFilterDto());
  }

  @Query()
  async vendor(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.vendorService.getVendorById(tenantId, id);
  }

  @Mutation()
  async createVendor(@Args('tenantId') tenantId: string, @Args('input') input: CreateVendorDto) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.vendorService.createVendor(tenantId, input);
  }

  @Mutation()
  async updateVendor(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
    @Args('input') input: UpdateVendorDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.vendorService.updateVendor(tenantId, id, input);
  }

  @Mutation()
  async updateVendorStatus(
    @Args('tenantId') tenantId: string,
    @Args('id') id: string,
    @Args('status') status: VendorStatus,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.vendorService.updateVendorStatus(tenantId, id, status);
  }

  @Mutation()
  async deleteVendor(@Args('tenantId') tenantId: string, @Args('id') id: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    await this.vendorService.deleteVendor(tenantId, id);
    return true;
  }

  @Query()
  async vendorRiskProfile(
    @Args('tenantId') tenantId: string,
    @Args('vendorId') vendorId: string,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.vendorService.getVendorRiskProfile(tenantId, vendorId);
  }

  @Query()
  async vendorRiskStats(@Args('tenantId') tenantId: string) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.vendorService.getVendorRiskStats(tenantId);
  }

  @Mutation()
  async createAssessment(
    @Args('tenantId') tenantId: string,
    @Args('input') input: CreateAssessmentDto,
  ) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.vendorService.createAssessment(tenantId, input);
  }

  @Mutation()
  async createBreach(@Args('tenantId') tenantId: string, @Args('input') input: CreateBreachDto) {
    if (!tenantId) throw new BadRequestException('tenantId is required');
    return this.vendorService.createBreach(tenantId, input);
  }
}
