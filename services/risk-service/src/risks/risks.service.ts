import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { CreateRiskDto, UpdateRiskDto, RiskFilterDto } from './dto';

@Injectable()
export class RisksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new risk for a tenant
   */
  async createRisk(tenantId: string, dto: CreateRiskDto) {
    // Calculate inherent risk score: probability * impact
    const inherentScore = dto.probability * dto.inherentImpact;

    return this.prisma.risk.create({
      data: {
        tenantId,
        title: dto.title,
        description: dto.description,
        riskCategory: dto.riskCategory,
        probability: dto.probability,
        inherentImpact: dto.inherentImpact,
        inherentScore,
        ownerId: dto.ownerId,
        businessUnit: dto.businessUnit,
        targetMitigationDate: dto.targetMitigationDate,
        status: 'active',
      },
      include: {
        owner: true,
        mitigations: true,
      },
    });
  }

  /**
   * Get all risks for a tenant with filtering
   */
  async getRisks(tenantId: string, filter: RiskFilterDto) {
    return this.prisma.risk.findMany({
      where: {
        tenantId,
        deletedAt: null,
        ...(filter.status && { status: filter.status }),
        ...(filter.riskCategory && { riskCategory: filter.riskCategory }),
        ...(filter.ownerId && { ownerId: filter.ownerId }),
      },
      orderBy: {
        [filter.sortBy || 'createdAt']: filter.sortOrder || 'desc',
      },
      take: filter.limit || 50,
      skip: filter.offset || 0,
      include: {
        owner: true,
        mitigations: true,
        metrics: true,
      },
    });
  }

  /**
   * Get a single risk by ID
   */
  async getRiskById(riskId: string, tenantId: string) {
    const risk = await this.prisma.risk.findUnique({
      where: { id: riskId },
      include: {
        owner: true,
        mitigations: true,
        metrics: true,
      },
    });

    if (!risk) {
      throw new NotFoundException(`Risk ${riskId} not found`);
    }

    if (risk.tenantId !== tenantId) {
      throw new BadRequestException('Tenant mismatch');
    }

    return risk;
  }

  /**
   * Update a risk
   */
  async updateRisk(riskId: string, tenantId: string, dto: UpdateRiskDto) {
    const risk = await this.getRiskById(riskId, tenantId);

    // Recalculate scores if probability or impact changed
    const inherentScore = dto.probability
      ? (dto.probability * (dto.inherentImpact || risk.inherentImpact))
      : risk.inherentScore;

    return this.prisma.risk.update({
      where: { id: riskId },
      data: {
        ...dto,
        inherentScore,
      },
      include: {
        owner: true,
        mitigations: true,
      },
    });
  }

  /**
   * Calculate residual risk score
   */
  async calculateResidualScore(riskId: string, tenantId: string) {
    const risk = await this.getRiskById(riskId, tenantId);

    if (!risk.mitigations.length) {
      throw new BadRequestException('No mitigations linked to risk');
    }

    // Calculate average mitigation effectiveness
    const avgEffectiveness =
      risk.mitigations.reduce((sum, m) => sum + m.effectiveness, 0) /
      risk.mitigations.length;

    // Residual impact = inherent impact * (1 - effectiveness)
    const residualImpact = Math.ceil(
      risk.inherentImpact * (1 - avgEffectiveness / 100),
    );

    // Residual score = probability * residual impact
    const residualScore = risk.probability * residualImpact;

    return this.prisma.risk.update({
      where: { id: riskId },
      data: {
        residualImpact,
        residualScore,
      },
    });
  }

  /**
   * Get risk heatmap data
   */
  async getRiskHeatmap(tenantId: string) {
    const risks = await this.prisma.risk.findMany({
      where: {
        tenantId,
        deletedAt: null,
        status: 'active',
      },
      select: {
        probability: true,
        inherentImpact: true,
      },
    });

    // Create 5x5 heatmap matrix
    const heatmap = Array.from({ length: 5 }, () => Array(5).fill(0));

    risks.forEach((risk) => {
      heatmap[risk.inherentImpact - 1][risk.probability - 1]++;
    });

    return heatmap;
  }

  /**
   * Soft delete a risk
   */
  async deleteRisk(riskId: string, tenantId: string) {
    const risk = await this.getRiskById(riskId, tenantId);

    return this.prisma.risk.update({
      where: { id: riskId },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Get KRIs for a risk
   */
  async getRiskKRIs(riskId: string, tenantId: string) {
    const risk = await this.getRiskById(riskId, tenantId);

    return this.prisma.kRI.findMany({
      where: { riskId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
