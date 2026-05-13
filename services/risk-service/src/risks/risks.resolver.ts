import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RisksService } from './risks.service';
import { CreateRiskDto, UpdateRiskDto, RiskFilterDto } from './dto';

// TODO: Define GraphQL types/ObjectTypes for Risk, RiskPayload, etc.
@Resolver('Risk')
export class RisksResolver {
  constructor(private readonly risksService: RisksService) {}

  /**
   * Query: Get all risks for a tenant
   */
  @Query()
  async risks(
    @Args('filter', { nullable: true }) filter?: RiskFilterDto,
    @Args('tenantId') tenantId?: string,
  ) {
    // Extract from context if not provided
    const tid = tenantId || 'default';
    return this.risksService.getRisks(tid, filter || {});
  }

  /**
   * Query: Get a single risk
   */
  @Query()
  async risk(
    @Args('id') id: string,
    @Args('tenantId') tenantId?: string,
  ) {
    const tid = tenantId || 'default';
    return this.risksService.getRiskById(id, tid);
  }

  /**
   * Mutation: Create a risk
   */
  @Mutation()
  async createRisk(
    @Args('input') input: CreateRiskDto,
    @Args('tenantId') tenantId?: string,
  ) {
    const tid = tenantId || 'default';
    return this.risksService.createRisk(tid, input);
  }

  /**
   * Mutation: Update a risk
   */
  @Mutation()
  async updateRisk(
    @Args('id') id: string,
    @Args('input') input: UpdateRiskDto,
    @Args('tenantId') tenantId?: string,
  ) {
    const tid = tenantId || 'default';
    return this.risksService.updateRisk(id, tid, input);
  }

  /**
   * Mutation: Delete a risk
   */
  @Mutation()
  async deleteRisk(
    @Args('id') id: string,
    @Args('tenantId') tenantId?: string,
  ) {
    const tid = tenantId || 'default';
    return this.risksService.deleteRisk(id, tid);
  }

  /**
   * Mutation: Calculate residual score
   */
  @Mutation()
  async calculateResidualScore(
    @Args('id') id: string,
    @Args('tenantId') tenantId?: string,
  ) {
    const tid = tenantId || 'default';
    return this.risksService.calculateResidualScore(id, tid);
  }

  /**
   * Query: Get risk heatmap
   */
  @Query()
  async riskHeatmap(@Args('tenantId') tenantId?: string) {
    const tid = tenantId || 'default';
    return this.risksService.getRiskHeatmap(tid);
  }
}
