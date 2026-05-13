import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateVendorDto,
  UpdateVendorDto,
  CreateAssessmentDto,
  CreateBreachDto,
  VendorFilterDto,
  VendorStatus,
  AssessmentStatus,
  BreachStatus,
} from './dto';

@Injectable()
export class VendorService {
  constructor(private readonly prisma: PrismaService) {}

  // Vendor Operations
  async createVendor(tenantId: string, input: CreateVendorDto) {
    return this.prisma.vendor.create({
      data: {
        ...input,
        tenantId,
        assessments: {
          create: [],
        },
        breaches: {
          create: [],
        },
      },
      include: { assessments: true, breaches: true },
    });
  }

  async getVendors(tenantId: string, filter: VendorFilterDto) {
    const where = {
      tenantId,
      deletedAt: null,
      ...(filter.classification && { classification: filter.classification }),
      ...(filter.status && { status: filter.status }),
      ...(filter.industry && { industry: filter.industry }),
      ...(filter.country && { country: filter.country }),
      ...(filter.managedBy && { managedBy: filter.managedBy }),
      ...(filter.search && {
        OR: [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [vendors, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        include: { assessments: true, breaches: true },
        take: filter.limit,
        skip: filter.offset,
        orderBy: { [filter.sortBy]: filter.sortOrder },
      }),
      this.prisma.vendor.count({ where }),
    ]);

    return { data: vendors, total, limit: filter.limit, offset: filter.offset };
  }

  async getVendorById(tenantId: string, id: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: { assessments: true, breaches: true },
    });

    if (!vendor || vendor.tenantId !== tenantId || vendor.deletedAt) {
      throw new NotFoundException(`Vendor ${id} not found`);
    }

    return vendor;
  }

  async updateVendor(tenantId: string, id: string, input: UpdateVendorDto) {
    await this.getVendorById(tenantId, id);

    // Recalculate risk score if assessments exist
    let updatedData = { ...input };
    if (input.riskScore === undefined) {
      const assessments = await this.prisma.assessment.findMany({
        where: { vendorId: id, status: AssessmentStatus.COMPLETED },
      });

      if (assessments.length > 0) {
        const avgScore = assessments.reduce((sum, a) => sum + (a.score || 0), 0) / assessments.length;
        updatedData.riskScore = Math.round(avgScore);
      }
    }

    return this.prisma.vendor.update({
      where: { id },
      data: updatedData,
      include: { assessments: true, breaches: true },
    });
  }

  async updateVendorStatus(tenantId: string, id: string, status: VendorStatus) {
    await this.getVendorById(tenantId, id);

    return this.prisma.vendor.update({
      where: { id },
      data: { status },
      include: { assessments: true, breaches: true },
    });
  }

  async deleteVendor(tenantId: string, id: string) {
    const vendor = await this.getVendorById(tenantId, id);

    return this.prisma.vendor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Assessment Operations
  async createAssessment(tenantId: string, input: CreateAssessmentDto) {
    const vendor = await this.getVendorById(tenantId, input.vendorId);

    return this.prisma.assessment.create({
      data: {
        ...input,
        tenantId,
      },
      include: { vendor: true },
    });
  }

  async getVendorAssessments(tenantId: string, vendorId: string) {
    await this.getVendorById(tenantId, vendorId);

    return this.prisma.assessment.findMany({
      where: {
        tenantId,
        vendorId,
        deletedAt: null,
      },
      orderBy: { assessmentDate: 'desc' },
    });
  }

  async updateAssessment(tenantId: string, id: string, input: Partial<CreateAssessmentDto>) {
    const assessment = await this.prisma.assessment.findUnique({ where: { id } });

    if (!assessment || assessment.tenantId !== tenantId || assessment.deletedAt) {
      throw new NotFoundException(`Assessment ${id} not found`);
    }

    return this.prisma.assessment.update({
      where: { id },
      data: input,
      include: { vendor: true },
    });
  }

  async deleteAssessment(tenantId: string, id: string) {
    const assessment = await this.prisma.assessment.findUnique({ where: { id } });

    if (!assessment || assessment.tenantId !== tenantId || assessment.deletedAt) {
      throw new NotFoundException(`Assessment ${id} not found`);
    }

    return this.prisma.assessment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Breach Operations
  async createBreach(tenantId: string, input: CreateBreachDto) {
    const vendor = await this.getVendorById(tenantId, input.vendorId);

    // Update vendor risk score due to breach
    await this.prisma.vendor.update({
      where: { id: input.vendorId },
      data: { riskScore: Math.min(100, (vendor.riskScore || 0) + 15) },
    });

    return this.prisma.breach.create({
      data: {
        ...input,
        tenantId,
      },
      include: { vendor: true },
    });
  }

  async getVendorBreaches(tenantId: string, vendorId: string) {
    await this.getVendorById(tenantId, vendorId);

    return this.prisma.breach.findMany({
      where: {
        tenantId,
        vendorId,
        deletedAt: null,
      },
      orderBy: { detectedDate: 'desc' },
    });
  }

  async updateBreach(tenantId: string, id: string, input: Partial<CreateBreachDto>) {
    const breach = await this.prisma.breach.findUnique({ where: { id } });

    if (!breach || breach.tenantId !== tenantId || breach.deletedAt) {
      throw new NotFoundException(`Breach ${id} not found`);
    }

    return this.prisma.breach.update({
      where: { id },
      data: input,
      include: { vendor: true },
    });
  }

  async deleteBreach(tenantId: string, id: string) {
    const breach = await this.prisma.breach.findUnique({ where: { id } });

    if (!breach || breach.tenantId !== tenantId || breach.deletedAt) {
      throw new NotFoundException(`Breach ${id} not found`);
    }

    return this.prisma.breach.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Vendor Risk Analytics
  async getVendorRiskProfile(tenantId: string, vendorId: string) {
    const vendor = await this.getVendorById(tenantId, vendorId);

    const assessments = await this.prisma.assessment.findMany({
      where: { vendorId, deletedAt: null },
    });

    const breaches = await this.prisma.breach.findMany({
      where: { vendorId, deletedAt: null },
    });

    const lastAssessment = assessments.length > 0 ? assessments[0] : null;
    const lastBreach = breaches.length > 0 ? breaches[0] : null;
    const activeBreaches = breaches.filter((b) => b.status !== BreachStatus.RESOLVED).length;

    return {
      vendor,
      assessmentCount: assessments.length,
      breachCount: breaches.length,
      activeBreaches,
      lastAssessmentDate: lastAssessment?.assessmentDate,
      lastAssessmentScore: lastAssessment?.score,
      lastBreachDate: lastBreach?.detectedDate,
      riskTrend: this.calculateRiskTrend(assessments),
    };
  }

  async getVendorRiskStats(tenantId: string) {
    const vendors = await this.prisma.vendor.findMany({
      where: { tenantId, deletedAt: null },
      select: { classification: true, riskScore: true },
    });

    const byClassification = {
      critical: vendors.filter((v) => v.classification === 'critical').length,
      high: vendors.filter((v) => v.classification === 'high').length,
      medium: vendors.filter((v) => v.classification === 'medium').length,
      low: vendors.filter((v) => v.classification === 'low').length,
    };

    const avgRiskScore = vendors.length > 0 ? Math.round(vendors.reduce((sum, v) => sum + (v.riskScore || 0), 0) / vendors.length) : 0;
    const highRiskVendors = vendors.filter((v) => (v.riskScore || 0) >= 70).length;

    return {
      totalVendors: vendors.length,
      byClassification,
      averageRiskScore: avgRiskScore,
      highRiskVendorCount: highRiskVendors,
    };
  }

  async getVendorsRequiringAssessment(tenantId: string, daysOverdue: number = 90) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - daysOverdue);

    return this.prisma.vendor.findMany({
      where: {
        tenantId,
        deletedAt: null,
        assessments: {
          none: {
            assessmentDate: { gt: pastDate },
          },
        },
      },
      include: { assessments: true, breaches: true },
      orderBy: { classification: 'desc' },
    });
  }

  private calculateRiskTrend(assessments: any[]): 'improving' | 'stable' | 'declining' {
    if (assessments.length < 2) return 'stable';

    const recent = assessments.slice(0, 3);
    const avgRecent = recent.reduce((sum, a) => sum + (a.score || 0), 0) / recent.length;
    const avgPrior = assessments.slice(3, 6).reduce((sum, a) => sum + (a.score || 0), 0) / Math.max(1, assessments.slice(3, 6).length);

    if (avgRecent < avgPrior - 5) return 'improving';
    if (avgRecent > avgPrior + 5) return 'declining';
    return 'stable';
  }
}
