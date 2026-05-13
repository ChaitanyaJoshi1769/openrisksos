import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateFrameworkDto,
  UpdateFrameworkDto,
  CreateControlDto,
  CreateEvidenceDto,
  CreateControlTestDto,
  ComplianceFilterDto,
  ControlStatus,
} from './dto';

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  // Framework Operations
  async createFramework(tenantId: string, input: CreateFrameworkDto) {
    return this.prisma.complianceFramework.create({
      data: {
        ...input,
        tenantId,
        controls: {
          create: [],
        },
      },
      include: { controls: true },
    });
  }

  async getFrameworks(tenantId: string, filter: ComplianceFilterDto) {
    const where = {
      tenantId,
      deletedAt: null,
      ...(filter.frameworkType && { type: filter.frameworkType }),
    };

    const [frameworks, total] = await Promise.all([
      this.prisma.complianceFramework.findMany({
        where,
        include: { controls: true },
        take: filter.limit,
        skip: filter.offset,
        orderBy: { [filter.sortBy]: filter.sortOrder },
      }),
      this.prisma.complianceFramework.count({ where }),
    ]);

    return { data: frameworks, total, limit: filter.limit, offset: filter.offset };
  }

  async getFrameworkById(tenantId: string, id: string) {
    const framework = await this.prisma.complianceFramework.findUnique({
      where: { id },
      include: { controls: { include: { evidence: true, tests: true } } },
    });

    if (!framework || framework.tenantId !== tenantId || framework.deletedAt) {
      throw new NotFoundException(`Framework ${id} not found`);
    }

    return framework;
  }

  async updateFramework(tenantId: string, id: string, input: UpdateFrameworkDto) {
    const framework = await this.getFrameworkById(tenantId, id);

    return this.prisma.complianceFramework.update({
      where: { id },
      data: input,
      include: { controls: true },
    });
  }

  async deleteFramework(tenantId: string, id: string) {
    const framework = await this.getFrameworkById(tenantId, id);

    return this.prisma.complianceFramework.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Control Operations
  async createControl(tenantId: string, input: CreateControlDto) {
    const framework = await this.prisma.complianceFramework.findUnique({
      where: { id: input.frameworkId },
    });

    if (!framework || framework.tenantId !== tenantId) {
      throw new BadRequestException('Framework not found or does not belong to tenant');
    }

    return this.prisma.complianceControl.create({
      data: {
        ...input,
        tenantId,
      },
      include: { framework: true, evidence: true, tests: true },
    });
  }

  async getControls(tenantId: string, filter: ComplianceFilterDto) {
    const where = {
      tenantId,
      deletedAt: null,
      ...(filter.frameworkId && { frameworkId: filter.frameworkId }),
      ...(filter.status && { status: filter.status }),
      ...(filter.owner && { owner: filter.owner }),
    };

    const [controls, total] = await Promise.all([
      this.prisma.complianceControl.findMany({
        where,
        include: { framework: true, evidence: true, tests: true },
        take: filter.limit,
        skip: filter.offset,
        orderBy: { [filter.sortBy]: filter.sortOrder },
      }),
      this.prisma.complianceControl.count({ where }),
    ]);

    return { data: controls, total, limit: filter.limit, offset: filter.offset };
  }

  async getControlById(tenantId: string, id: string) {
    const control = await this.prisma.complianceControl.findUnique({
      where: { id },
      include: { framework: true, evidence: true, tests: true },
    });

    if (!control || control.tenantId !== tenantId || control.deletedAt) {
      throw new NotFoundException(`Control ${id} not found`);
    }

    return control;
  }

  async updateControl(tenantId: string, id: string, input: Partial<CreateControlDto>) {
    await this.getControlById(tenantId, id);

    return this.prisma.complianceControl.update({
      where: { id },
      data: input,
      include: { framework: true, evidence: true, tests: true },
    });
  }

  async updateControlStatus(tenantId: string, id: string, status: ControlStatus) {
    await this.getControlById(tenantId, id);

    return this.prisma.complianceControl.update({
      where: { id },
      data: { status },
      include: { framework: true, evidence: true, tests: true },
    });
  }

  async deleteControl(tenantId: string, id: string) {
    const control = await this.getControlById(tenantId, id);

    return this.prisma.complianceControl.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Evidence Operations
  async createEvidence(tenantId: string, input: CreateEvidenceDto) {
    const control = await this.getControlById(tenantId, input.controlId);

    return this.prisma.evidence.create({
      data: {
        ...input,
        tenantId,
      },
      include: { control: true },
    });
  }

  async getEvidenceByControl(tenantId: string, controlId: string) {
    await this.getControlById(tenantId, controlId);

    return this.prisma.evidence.findMany({
      where: {
        tenantId,
        controlId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteEvidence(tenantId: string, id: string) {
    const evidence = await this.prisma.evidence.findUnique({ where: { id } });

    if (!evidence || evidence.tenantId !== tenantId || evidence.deletedAt) {
      throw new NotFoundException(`Evidence ${id} not found`);
    }

    return this.prisma.evidence.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Control Test Operations
  async createControlTest(tenantId: string, input: CreateControlTestDto) {
    const control = await this.getControlById(tenantId, input.controlId);

    return this.prisma.controlTest.create({
      data: {
        ...input,
        tenantId,
      },
      include: { control: true },
    });
  }

  async getControlTests(tenantId: string, controlId: string) {
    await this.getControlById(tenantId, controlId);

    return this.prisma.controlTest.findMany({
      where: {
        tenantId,
        controlId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getComplianceStatus(tenantId: string) {
    const frameworks = await this.prisma.complianceFramework.count({
      where: { tenantId, deletedAt: null },
    });

    const controls = await this.prisma.complianceControl.findMany({
      where: { tenantId, deletedAt: null },
      select: { status: true },
    });

    const statusCounts = controls.reduce(
      (acc, control) => {
        acc[control.status] = (acc[control.status] || 0) + 1;
        return acc;
      },
      {} as Record<ControlStatus, number>,
    );

    const totalControls = controls.length;
    const compliantControls = statusCounts[ControlStatus.COMPLIANT] || 0;
    const compliancePercentage =
      totalControls > 0 ? Math.round((compliantControls / totalControls) * 100) : 0;

    return {
      frameworks,
      totalControls,
      compliantControls,
      nonCompliantControls: statusCounts[ControlStatus.NON_COMPLIANT] || 0,
      inProgressControls: statusCounts[ControlStatus.IN_PROGRESS] || 0,
      notStartedControls: statusCounts[ControlStatus.NOT_STARTED] || 0,
      compliancePercentage,
    };
  }
}
